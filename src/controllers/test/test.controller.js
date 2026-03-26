import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { test } from "../../models/test.models.js";

const insertTestData = asyncHandler(async (req, res) => {
  const { name, check } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const testData = await test.create({
    name,
    check,
  });

  try {
    const createdTest = await test.findById(testData._id).select("-check");

    if (!createdTest) {
      throw new ApiError(500, "Failed to create test data");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(200, createdTest, "Test data created successfully"),
      );
  } catch (error) {
    throw new ApiError(500 , error.message || "An error occurred while creating test data");
  }
});

const generateTokens = async(userId) => {
    try {
        const testt = await test.findById(userId);
        const accessToken = await testt.generateAccessToken();
        const refreshToken = await testt.generateRefreshToken();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500 , error.message || "An error occurred while generating tokens");
    }
}

const testLogin = asyncHandler(async(req,res) => {
    const { name , check } = req.body;

    if(!name || check === undefined){
        throw new ApiError(400 , "Name and check are required");
    }

    const testt = await test.findOne({ name });

    if(!testt){
        throw new ApiError(404 , "Test data not found");
    }

    const { accessToken , refreshToken } = await generateTokens(testt._id);

    const loggedTest = await test.findById(testt._id).select("-check");

    const options = {
        httpOnly : true,
        secure: true
    }

    return res.status(200)
                .cookie("refreshToken" , refreshToken , options)
                .cookie("accessToken" , accessToken , options)
                .json(
                    new ApiResponse(200 , {
                        data : loggedTest,
                        accessToken : accessToken,
                        refreshToken : refreshToken,
                    },"Test Login Success")
                )
})

export { insertTestData , testLogin };
