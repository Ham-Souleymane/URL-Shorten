const shortenUrlList = document.getElementById('shorten-list');

const getShortUrls = async () => {
    const url = 'https://www.shorten-url-api.infobrains.club/api/private/urls';
    const token = localStorage.getItem('token');
    const page = 1;
    const limit = 10;

    const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const jsonResponse = await response.json();

    if (response.status === 500) {
        alert('Internal server error');
    }

    if (response.status === 401) {
        alert('Unauthorized');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }

    if (response.status === 200) {
        const data = jsonResponse.data;
        const pagination = jsonResponse.pagination;
        shortenUrlList.innerHTML = "";
        data.forEach((shortUrl) => {
            const li = document.createElement('li');
            li.setAttribute('url-id', shortUrl.id);
           
            li.innerHTML = `
            <div class="shorten-url">
                <div class="shorten-url__original-url">
                    <p><strong>Original:</strong> ${shortUrl.originalUrl}</p>
                </div>
                <div class="shorten-url__short-url">
                    <p><strong>Shortened:</strong> 
                        <a href="${shortUrl.shortUrl}" target="_blank" rel="noopener noreferrer">
                            ${shortUrl.shortUrl}
                        </a>
                    </p>
                   
                    <button class="delete_but">
                            <img src="../assets/delete.png" alt="" >
                    </button>
                    <button class="edit_but">
                            <img src="../assets/edit.png" alt="" >
                    </button>
                    
                    
                    <button class="show_but">
                            <img src="../assets/view.png" alt="" >
                    </button>

                      <div class="shorten-details" style="display: none;">
                     
<div class="shorten-url__clicks">
    <p><strong>Clicks:</strong> ${shortUrl.clicks}</p>
</div>
<div class="shorten-url__created-at">
    <p><strong>Created At:</strong> ${new Date(shortUrl.createdAt).toLocaleString()}</p>
</div>
<div class="shorten-url__updated-at">
    <p><strong>Updated At:</strong> ${new Date(shortUrl.updatedAt).toLocaleString()}</p>
</div>
                </div>

               
            </div>
            `;


            const deleteButton =li.querySelector('.delete_but');
            deleteButton.addEventListener('click', () => {
            
                deletef(shortUrl.id)

            }); 

            const showButton= li.querySelector('.show_but');
            const detailsDiv = li.querySelector('.shorten-details');
            const showImg = showButton.querySelector('img');
            showButton.addEventListener('click',()=>{
                if (detailsDiv.style.display === "none") {
                    detailsDiv.style.display = "block";
                    showImg.src='../assets/close-eye.png';
                } else {
                    detailsDiv.style.display = "none";
                    showImg.src='../assets/view.png';
                }
            })
            

          const editButton=li.querySelector('.edit_but');
        
          editButton.addEventListener('click',()=>{
              handleEdit(shortUrl.id);
            


          })


            shortenUrlList.appendChild(li);
            
        });
    }
    
};

getShortUrls();


//handling delete
 async  function deletef(id){

    const url = `https://www.shorten-url-api.infobrains.club/api/private/urls/${id}`;
 const token= localStorage.getItem('token');
    const response =await fetch(url,{
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        }
    });
   
    if(response.status===200){
       
        document.querySelector(`li[url-id="${id}"]`).remove();
    }else{
     const Res=response.json();
     console.log(Res.message);
    }

}


async function handleEdit(id) {
    const popup = document.getElementById("popup");
    const inputField = document.getElementById("new-URL");
    const confirmButton = document.getElementById("confirm-edit");
    const closeButton = document.getElementById("close-popup");

    // Clear previous input
    inputField.value = "";

    // Show the dialog
    popup.showModal();

    // Handle form submission
    confirmButton.onclick = async () => {
        const newUrl = inputField.value.trim();
        if (!newUrl) {
            alert("Please enter a valid URL.");
            return;
        }

        const url = `https://www.shorten-url-api.infobrains.club/api/private/urls/${id}`;
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ url: newUrl })
        });

        if (response.ok) {
       
            popup.close();
            getShortUrls(); 
        } else {
            const res = await response.json();
            alert(res.message);
        }
    };

  
    closeButton.onclick = () => popup.close();
}
