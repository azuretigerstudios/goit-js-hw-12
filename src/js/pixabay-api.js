import axios from 'axios';

const API_KEY = "53603098-b02aa90545e6d43ec2b5cc7bc"; // Kendi Key'ini yapıştır
const BASE_URL = "https://pixabay.com/api/";

export async function fetchImages(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: 15, // Mentor listesindeki "Max 20" kuralına uymak için 15 yaptık.
    page: page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}