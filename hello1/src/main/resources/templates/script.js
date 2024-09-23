async function handleSubmit(event){
    //prevent default
    event.preventDefault();

    //get values

    const id = document.getElementById("id").value;
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    const userEntity1 = {id, newUsername, newPassword};

    console.log("This is your user data "+ JSON.stringify(userEntity1));

    const baseURL = "http://localhost:3306/addUserEntity"

    try{
        const response = await fetch(baseURL, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(userEntity1)
        });
        if(response.ok){
            alert("User Added Sussessfully");
        }
    } catch (error){
        console.log("error is coming while adding the student" + error);
    }
}

