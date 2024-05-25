const API_URL = 'http://192.168.0.37:5000/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/Login`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return await response.json();
};

export const registerUser = async (email, password) => {
    var confirmpassword = password;
  const response = await fetch(`${API_URL}/Accounts`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, confirmpassword })
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return await response.json();
};

export const fetchUserData = async (token) => {
  const response = await fetch(`${API_URL}/Accounts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Fetching user data failed');
  }
  
  return await response.json();
};

export const fetchProductCategory = async (barcode) => {
    try {
        const response = await fetch(`http://192.168.0.37:5000/api/products/${barcode}`);

        if (!response.ok) {
            throw new Error('Fetching product data failed');
        }

        const product = await response.json();
        return product.category;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const fetchUserProducts = async (token) => {
  try {
    const user = await fetchUserData (token);
    const response = await fetch(`http://192.168.0.37:5000/api/products/user/${user[0].id}`);
    return await response.json();
  } catch (error) {
    console.error('Error when loading data:', error);
  }
};