import Cookies from 'js-cookie';

//add new product

export const addNewProduct = async (formData) => {
  try {
    const response = await fetch('/api/admin/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'applictaion/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//render all products

export const getAllAdminProducts = async () => {
  try {
    const res = await fetch(
      'https://myfash-ecommerce-r2ztgsyum-fardins-projects-0e134bfe.vercel.app/api/admin/all-products',
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//update product

export const updateProduct = async (formData) => {
  try {
    const res = await fetch('/api/admin/update-product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'applictaion/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(formData),
    });

    const data = res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//delete product

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`/api/admin/delete-product?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//render productByCategory

export const productByCategory = async (id) => {
  try {
    const res = await fetch(
      `https://myfash-ecommerce-r2ztgsyum-fardins-projects-0e134bfe.vercel.app/api/admin/product-by-category?id=${id}`,
      { method: 'GET', cache: 'no-store' }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//render productByID

export const productById = async (id) => {
  try {
    const res = await fetch(
      `https://myfash-ecommerce-r2ztgsyum-fardins-projects-0e134bfe.vercel.app/api/admin/product-by-id?id=${id}`,
      { method: 'GET', cache: 'no-store' }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
