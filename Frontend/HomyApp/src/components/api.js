const API_URL = 'https://webapihomyapp.azure-api.net/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/Login`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'd212f804900046329fa3bd549e1be84d'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error login:', errorText);
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
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'd212f804900046329fa3bd549e1be84d'
    },
    body: JSON.stringify({ email, password, confirmpassword })
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return await response.json();
};

export const fetchUserData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/Accounts`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': 'd212f804900046329fa3bd549e1be84d'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching user data:', errorText);
      throw new Error('Fetching user data failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    throw error;
  }
};


export const fetchProductCategory = async (barcode) => {
    try {
        const response = await fetch(`${API_URL}/products/${barcode}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Ocp-Apim-Subscription-Key': 'd212f804900046329fa3bd549e1be84d'
          }
        });

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
    const response = await fetch(`${API_URL}/products/user/${user[0].id}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': 'd212f804900046329fa3bd549e1be84d'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error when loading data:', error);
  }
};

export const addProduct = async (product) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Ocp-Apim-Subscription-Key': 'd212f804900046329fa3bd549e1be84d'
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error add product:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error when adding product', error);
    return { error: 'Error when adding product' };
  }
};