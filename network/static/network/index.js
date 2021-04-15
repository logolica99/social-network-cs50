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

        document.querySelector("#newPostSubmit").addEventListener("click",()=>{
            document.querySelector("#newPostSubmit").disabled = true
            if ( document.querySelector("#newPostTextarea").value.length!=0){
            fetch('/all_posts',{
                method:'POST',
                body:JSON.stringify({
                    content : document.querySelector("#newPostTextarea").value,
                    username : document.querySelector("#top_username").innerHTML
                    
                })
            })
        }
            document.querySelector("#newPostTextarea").value = ""
            document.querySelector("#newPostSubmit").disabled = false
            setTimeout(()=>loadposts('all'),50)
        })
        
        fetch('/all_posts')
        .then(response => response.json())
        .then(posts =>{
           
            all_posts = document.querySelector('.posts')
            all_posts.innerHTML = ''
            
            posts.forEach(element => {
               post = document.createElement('div');
               post.classList.add("post");
                html = `
                            <a href='/user/${element['username']}'><h4>${element['username']}</h4></a> 
                            
                            <p id="content${element['id']}">${element['content']}</p> 
                        
                        `
                if(document.querySelector("#top_username").innerHTML==element["username"]){

                    
                    html+=    `
                            <a id="edit"data-id="${element['id']}">Edit</a>
                            <div id="edit-box${element['id']}" style="display:none">
                           
                                <textarea data-id="${element['id']}"   id="edit_text${element['id']}"   rows="4" cols="50">${element['content']}</textarea>
                                <button class="btn btn-info" id="submit${element['id']}">Submit</button>
                            </div>
                            
                             
                            
                       `
                }
               if(element["liked"] == false){
                    html += `
                            <p class="date">${element['created_at']}</p> 
                            <p> <button data-id="${element['id']}" id="like" class="btn btn-dark btn-sm"  >Like</button> ${element['likes']}&#10084</p>    
                            
                        `
               }else{
                html+= `
                        <p class="date">${element['created_at']}</p> 
                        <p><button data-id="${element['id']}" id="unlike" class="btn btn-dark btn-sm" >Unlike</button>  ${element['likes']}&#10084</p>    

                    `
               }
                    post.innerHTML+=html
               all_posts.appendChild(post)
                
            });
            
            
        
        
        document.querySelectorAll("#like").forEach( like =>{
            like.addEventListener('click',()=>{
              like.disabled=true
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
                like.disabled=true
            fetch('/all_posts',{
                method:'PUT',
                body:JSON.stringify({
                    like: false,
                    post_id: like.dataset.id
                })
            })
            setTimeout(()=>loadposts('all'),50)
           
        })})
        document.querySelectorAll("#edit").forEach(edit =>{
            edit.addEventListener('click',()=>{
                edit_box = document.querySelector(`#edit-box${edit.dataset.id}`)
                if (edit_box.style.display=="block"){
                    
                    edit_box.style.display = "none";
                    document.querySelector(`#content${edit.dataset.id}`).style.display = "block"

                }else{
                    
                    edit_box.style.display="block";
                    document.querySelector(`#content${edit.dataset.id}`).style.display = "none";
                   
                }
                submit_button = document.querySelector(`#submit${edit.dataset.id}`)
                submit_button.addEventListener('click',()=>{
                    textarea = document.querySelector(`#edit_text${edit.dataset.id}`)
                    
                    fetch('/all_posts',{
                        method:'PUT',
                        body:JSON.stringify({
                            
                            
                            post_id: edit.dataset.id,
                            content: textarea.value
                        })
                    })
                    setTimeout(()=>loadposts('all'),50)
                })
            
            
            
            
            })
        })
    })
        
    }


    if(category=='following'){
        document.querySelector("#new-post").style.display = "none"

         fetch('/following')
        .then(response => response.json())
        .then(posts =>{
            
            all_posts = document.querySelector('.posts')
            all_posts.innerHTML = ''
            
            posts.forEach(element => {
               post = document.createElement('div');
               post.classList.add("post");
               html = `
                            <a href='/user/${element['username']}'><h4>${element['username']}</h4></a> 
                            
                            <p id="content${element['id']}">${element['content']}</p> 
                        
                        `
                if(document.querySelector("#top_username").innerHTML==element["username"]){

                    
                    html+=    `
                            <a id="edit"data-id="${element['id']}">Edit</a>
                            <div id="edit-box${element['id']}" style="display:none">
                           
                                <textarea data-id="${element['id']}"   id="edit_text${element['id']}"   rows="4" cols="50">${element['content']}</textarea>
                                <button class="btn btn-info" id="submit${element['id']}">Submit</button>
                            </div>
                            
                             
                            
                       `
                }
               if(element["liked"] == false){
                    html += `
                            <p class="date">${element['created_at']}</p> 
                            <p> <button data-id="${element['id']}" id="like" class="btn btn-dark btn-sm"  >Like</button> ${element['likes']}&#10084</p>    
                            
                        `
               }else{
                html+= `
                        <p class="date">${element['created_at']}</p> 
                        <p><button data-id="${element['id']}" id="unlike" class="btn btn-dark btn-sm" >Unlike</button>  ${element['likes']}&#10084</p>    

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
            setTimeout(()=>loadposts('following'),50)
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
            setTimeout(()=>loadposts('following'),50)
           
        })})
    })
    }

}