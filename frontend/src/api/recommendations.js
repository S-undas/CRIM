const BASE_URL = "http://127.0.0.1:8000";

export const getRecommendations = async (uploadId, customerId) => {
    const token = localStorage.getItem("token");

    fetch(`http://127.0.0.1:8000/recommendations/${uploadId}/${customerId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });

  return res.json();
};