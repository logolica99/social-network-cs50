document.addEventListener('DOMContentLoaded', function() {
   
    document.querySelector("#all_posts").addEventListener('click', ()=>loadposts('all'))
    document.querySelector("#following").addEventListener('click', ()=>loadposts('following'))
    loadposts('all');
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




function loadposts(category){

    if(category=='all'){


        
        fetch('/all_posts')
        .then(response => response.json())
        .then(posts =>{
            console.log(posts);
            all_posts = document.querySelector('.posts')
            all_posts.innerHTML = ''
            
            posts.forEach(element => {
               post = document.createElement('div');
               post.classList.add("post");
               if(element["liked"] == false){
                    html = `
                            <a href='/user/${element['username']}'><h4>${element['username']}</h4></a>
                            <p>${element['content']}</p> 
                            <p class="date">${element['created_at']}</p>  
                            <p> <a data-id="${element['id']}" id="like" class="like">Like</a> ${element['likes']}&#10084</p>    
                            
                    `
               }else{
                html = `
                    <a href='/user/${element['username']}'><h4>${element['username']}</h4></a>
                    <p>${element['content']}</p> 
                    <p class="date">${element['created_at']}</p>  
                    <p><a data-id="${element['id']}" id="unlike" class="like">Unlike</a>  ${element['likes']}&#10084</p>    

                 `
               }
                    post.innerHTML+=html
               all_posts.appendChild(post)
                
            });
            
            

        
        document.querySelectorAll("#like").forEach( like =>{
            like.addEventListener('click',()=>{
            fetch('/all_posts',{
                method:'PUT',
                body:JSON.stringify({
                    like: true,
                    post_id: like.dataset.id
                })
            })
            setTimeout(()=>loadposts('all'),50)
        })})
        document.querySelectorAll("#unlike").forEach( like =>{
            like.addEventListener('click',()=>{
            fetch('/all_posts',{
                method:'PUT',
                body:JSON.stringify({
                    like: false,
                    post_id: like.dataset.id
                })
            })
            setTimeout(()=>loadposts('all'),50)
           
        })})
    })
        
    }


    if(category=='following'){


         fetch('/following')
        .then(response => response.json())
        .then(posts =>{
            console.log(posts);
            all_posts = document.querySelector('.posts')
            all_posts.innerHTML = ''
            
            posts.forEach(element => {
               post = document.createElement('div');
               post.classList.add("post");
               if(element["liked"] == false){
                    html = `
                            <a href='/user/${element['username']}'><h4>${element['username']}</h4></a>
                            <p>${element['content']}</p> 
                            <p class="date">${element['created_at']}</p>  
                            <p> <a data-id="${element['id']}" id="like" class="like">Like</a> ${element['likes']}&#10084</p>    
                            
                    `
               }else{
                html = `
                    <a href='/user/${element['username']}'><h4>${element['username']}</h4></a>
                    <p>${element['content']}</p> 
                    <p class="date">${element['created_at']}</p>  
                    <p><a data-id="${element['id']}" id="unlike" class="like">Unlike</a>  ${element['likes']}&#10084</p>    

                 `
               }
                    post.innerHTML+=html
               all_posts.appendChild(post)
                
            });
            
            

        
        document.querySelectorAll("#like").forEach( like =>{
            like.addEventListener('click',()=>{
            fetch('/all_posts',{
                method:'PUT',
                body:JSON.stringify({
                    like: true,
                    post_id: like.dataset.id
                })
            })
            setTimeout(()=>loadposts('all'),50)
        })})
        document.querySelectorAll("#unlike").forEach( like =>{
            like.addEventListener('click',()=>{
            fetch('/all_posts',{
                method:'PUT',
                body:JSON.stringify({
                    like: false,
                    post_id: like.dataset.id
                })
            })
            setTimeout(()=>loadposts('all'),50)
           
        })})
    })
    }

}