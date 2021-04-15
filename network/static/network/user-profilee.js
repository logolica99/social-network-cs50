  
  
document.addEventListener("DOMContentLoaded", function () {
    load_profile();
  });
  
  function load_profile() {
    user_id = document.querySelector("#hello").dataset.id;
    var username = "";
    fetch(`users/${user_id}`)
      .then((response) => response.json())
      .then((user_data) => {
        //console.log(user_data)
        user = document.createElement("div");
        document.querySelector("#user").innerHTML = "";
        user.classList.add("user_data");
        username = user_data[0]["username"];
  
        html = `
          <h3>${user_data[0]["username"]}</h3>
              <p>Followers <strong>${user_data[0]["follower"]}</strong> Following <strong>${user_data[0]["following"]}</strong></p>
          
          `;
        if (user_data[0]["can_follow"]) {
          if (user_data[0]["already_following"]) {
            html += `
                      <button id="unfollow" class="btn btn-dark">Unfollow</button>
                  `;
          } else {
            html += `
                          <button id="follow" class="btn btn-dark"> Follow </button>
                  `;
          }
        }
  
        user.innerHTML = html;
        document.querySelector("#user").appendChild(user);
        unfollow_button = document.querySelector("#unfollow");
        follow_button = document.querySelector("#follow");
        if (unfollow_button != null) {
          unfollow_button.addEventListener("click", () => {
            unfollow_button.disabled = true;
            fetch(`${user_data[0]["username"]}`, {
              method: "PUT",
              body: JSON.stringify({
                follow: false,
                username: user_data[0]["username"],
              }),
            });
            setTimeout(() => load_profile(), 50);
          });
        }
        if (follow_button != null) {
          follow_button.addEventListener("click", () => {
            follow_button.disabled = true;
            fetch(`${user_data[0]["username"]}`, {
              method: "PUT",
              body: JSON.stringify({
                follow: true,
                username: user_data[0]["username"],
              }),
            });
            setTimeout(() => load_profile(), 50);
          });
        }
        fetch("http://127.0.0.1:8000/all_posts")
        .then((response) => response.json())
        .then((posts) => {
          all_posts = document.querySelector(".posts");
          all_posts.innerHTML = "";
          posts.forEach((element) => {
            if (element["username"] == username) {
              // console.log(element)
    
              post = document.createElement("div");
              post.classList.add("post");
              post.classList.add("post");
              html = `
                                <a href='/user/${element["username"]}'><h4>${element["username"]}</h4></a> 
                                
                                <p id="content${element["id"]}">${element["content"]}</p> 
                            
                            `;
              if (
                document.querySelector("#top_username").innerHTML ==
                element["username"]
              ) {
                html += `
                                <a id="edit"data-id="${element["id"]}">Edit</a>
                                <div id="edit-box${element["id"]}" style="display:none">
                               
                                    <textarea data-id="${element["id"]}"   id="edit_text${element["id"]}"   rows="4" cols="50">${element["content"]}</textarea>
                                    <button class="btn btn-info" id="submit${element["id"]}">Submit</button>
                                </div>
                                
                                 
                                
                           `;
              }
              if (element["liked"] == false) {
                html += `
                                <p class="date">${element["created_at"]}</p> 
                                <p> <button data-id="${element["id"]}" id="like" class="btn btn-dark btn-sm"  >Like</button> ${element["likes"]}&#10084</p>    
                                
                            `;
              } else {
                html += `
                            <p class="date">${element["created_at"]}</p> 
                            <p><button data-id="${element["id"]}" id="unlike" class="btn btn-dark btn-sm" >Unlike</button>  ${element["likes"]}&#10084</p>    
    
                        `;
              }
              post.innerHTML += html;
              all_posts.appendChild(post);
            }
          });
    
          document.querySelectorAll("#like").forEach((like) => {
            like.addEventListener("click", () => {
              like.disabled = true;
              fetch("http://127.0.0.1:8000/all_posts", {
                method: "PUT",
                body: JSON.stringify({
                  like: true,
                  post_id: like.dataset.id,
                }),
              });
              setTimeout(() => load_profile(), 50);
            });
          });
          document.querySelectorAll("#unlike").forEach((like) => {
            like.addEventListener("click", () => {
              like.disabled = true;
              fetch("http://127.0.0.1:8000/all_posts", {
                method: "PUT",
                body: JSON.stringify({
                  like: false,
                  post_id: like.dataset.id,
                }),
              });
              setTimeout(() => load_profile(), 50);
            });
          });
    
          document.querySelectorAll("#edit").forEach((edit) => {
            //  console.log(edit)
            edit.addEventListener("click", () => {
            
              edit_box = document.querySelector(`#edit-box${edit.dataset.id}`);
              if (edit_box.style.display == "block") {
                edit_box.style.display = "none";
                document.querySelector(`#content${edit.dataset.id}`).style.display =
                  "block";
              } else {
                edit_box.style.display = "block";
                document.querySelector(`#content${edit.dataset.id}`).style.display =
                  "none";
              }
              submit_button = document.querySelector(`#submit${edit.dataset.id}`);
              submit_button.addEventListener("click", () => {
                textarea = document.querySelector(`#edit_text${edit.dataset.id}`);
    
                fetch("http://127.0.0.1:8000/all_posts", {
                  method: "PUT",
                  body: JSON.stringify({
                    post_id: edit.dataset.id,
                    content: textarea.value,
                  }),
                });
                setTimeout(() => load_profile(), 50);
              });
            });
          });
        });
      });

  }
  