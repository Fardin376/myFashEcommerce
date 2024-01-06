export const registerNewUser = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const finalData = await response.json();

    return finalData;
  } catch (error) {
    console.log('Error: ', error);
  }
};
