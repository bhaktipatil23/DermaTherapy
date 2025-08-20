import axios from "axios";

const api = axios.create({
  baseURL: "https://serverless.roboflow.com",
});


export const sendRegisterRequest = async (data, token) => {
  try {
    const response = await api.post("/register", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Register response:", response.data.message);
    return JSON.stringify({
      status: response.status,
      message: response.data.message,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

