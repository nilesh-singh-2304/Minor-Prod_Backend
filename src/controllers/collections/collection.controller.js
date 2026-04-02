import { Collection } from "../../models/Collections/collection.model.js";
import { User } from "../../models/User/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createCollection = asyncHandler(async (req, res) => {
  const { name, baseUrl } = req.body;
  const userId = req.user._id;

  if ([name, baseUrl].some((field) => field.trim() === "")) {
    throw new ApiError(400, "Name and baseUrl are required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not authenticated");
  }

  const isExistingCollection = await Collection.findOne({
    name: name.toLowerCase(),
    user: userId,
  });

  if (isExistingCollection) {
    throw new ApiError(
      409,
      "Collection with the same name already exists for this user",
    );
  }

  const collection = await Collection.create({
    name: name.toLowerCase(),
    baseUrl,
    user: userId,
    members: [
      {
        user: userId,
        role: "admin", // 🔥 creator is admin
      },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(200, collection, "Collection created successfully"));
});

const getAllCollections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not authenticated");
  }

  const collections = await Collection.find({
    $or: [
      { user: userId }, // owned
      { "members.user": userId }, // shared
    ],
  }).select("-createdAt -updatedAt -__v");

  console.log(collections);
  

  const userIdStr = userId.toString();

const owned = [];
const shared = [];

collections.forEach((col) => {
  const colObj = col.toObject();
  delete colObj.members; // ✅ remove before pushing
  

  if (col.user.toString() === userIdStr) {
    // owner → full access
    owned.push({
      ...colObj,
      role: "admin",
      canEdit: true,
    });
  } else {
    // find user's role in members
    const member = col.members.find(
      (m) => m.user.toString() === userIdStr
    );


    const role = member?.role || "viewer";
    shared.push({
      ...colObj,
      role,
      canEdit: role === "admin" || role === "editor",
    });
  }


//   delete col.members
});

  return res
    .status(200)
    .json(new ApiResponse(200, {owned , shared}, "All collections of user fetched"));
});

const getCollectionsWithRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const collections = await Collection.aggregate([
    {
      $match: {
        $or: [
          { user: userId },
          { "members.user": userId },
        ],
      },
    },

    // 🔥 get requests
    {
      $lookup: {
        from: "requests",
        localField: "_id",
        foreignField: "collection",
        as: "requests",
      },
    },

    // 🔥 compute role + ownership
    {
      $addFields: {
        isOwner: { $eq: ["$user", userId] },

        memberData: {
          $first: {
            $filter: {
              input: "$members",
              as: "m",
              cond: { $eq: ["$$m.user", userId] },
            },
          },
        },
      },
    },

    // 🔥 final role + permissions
    {
      $addFields: {
        role: {
          $cond: {
            if: "$isOwner",
            then: "admin",
            else: "$memberData.role",
          },
        },

        canEdit: {
          $cond: {
            if: "$isOwner",
            then: true,
            else: {
              $in: ["$memberData.role", ["admin", "editor"]],
            },
          },
        },
      },
    },

    // 🔥 clean output
    {
      $project: {
        _id: 1,
        name: 1,
        baseUrl: 1,
        requests: 1,
        role: 1,
        canEdit: 1,
        isOwner: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      collections,
      "Collections with requests fetched"
    )
  );
});

// const addMembersWithRole = asyncHandler(async (req, res) => {
//   const { email, role, collId } = req.body;
//   const user = req.user;

//   if (!email) {
//     throw new ApiError(400, "Enter valid Email");
//   }

//   const safeEmail = email.replace(/\./g, "_");

//   const mem = await User.findOne({
//     email: email,
//   });

//   if (!mem) {
//     throw new ApiError(404, "No user with this email ID found");
//   }

//   const isAlready = await Collection.findOne({
//     _id: collId,
//     [`members.${safeEmail}`]: { $exists: true },
//   });

//   if (isAlready) {
//     throw new ApiError(404, "Already a member !!");
//   }

//   const added = await Collection.findByIdAndUpdate(
//     collId,
//     {
//       $set: {
//         [`members.${safeEmail}`]: role,
//       },
//     },
//     { new: true },
//   );

//   return res
//     .status(200)
//     .json(new ApiResponse(200, added, "User Added to Collection Successfully"));
// });

const addMembersWithRole = asyncHandler(async (req, res) => {
  const { email, role, collId } = req.body;
  const user = req.user;

  if (!email || !role || !collId) {
    throw new ApiError(400, "All fields required");
  }

  const mem = await User.findOne({ email });

  if (!mem) {
    throw new ApiError(404, "User not found");
  }

  const collection = await Collection.findById(collId);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  // 🔐 permission check
  if (collection.user.toString() !== user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  // ❌ already member check
  const isAlready = collection.members.some(
    (m) => m.user.toString() === mem._id.toString()
  );

  if (isAlready) {
    throw new ApiError(409, "Already a member");
  }

  // ✅ role validation
  const allowedRoles = ["admin", "editor", "viewer"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  collection.members.push({
    user: mem._id,
    role,
  });

  await collection.save();

  return res.status(200).json(
    new ApiResponse(200, collection, "Member added successfully")
  );
});

export {
  createCollection,
  getAllCollections,
  getCollectionsWithRequests,
  addMembersWithRole,
};
