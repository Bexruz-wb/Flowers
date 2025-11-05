 const api = "https://68ecf647eff9ad3b1403ff41.mockapi.io/users";
let allData = [];

const list1 = document.querySelector(".list");
const box1 = document.querySelector(".addBox");
const btn1 = document.getElementById("addBtn");
const btn2 = document.getElementById("saveBtn");
const inp1 = document.getElementById("search");
const btn3 = document.getElementById("searchBtn");

let editBox;

 
function getAll() {
  fetch(api)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      allData = data;
      showAll(data);
    })
    .catch(function(err) {
      console.log("API:", err);
    });
}

 
function showAll(arr) {
  list1.innerHTML = "";
  arr.forEach(function(item) {
    let imgUrl;
    if (item.image && item.image !== "") {
      imgUrl = item.image;
    } else {
      imgUrl = "https://picsum.photos/200?random=" + item.id;
    }

    list1.innerHTML += `
      <div class="card">
        <img src="${imgUrl}">
        <h3>${item.name}</h3>
        <p>${item.description || ""}</p>
        <p><b>${item.price ? "$" + item.price : ""}</b></p>
        <button class="editBtn" data-id="${item.id}">Edit</button>
        <button class="delBtn" data-id="${item.id}">Delete</button>
      </div>
    `;
  });

 
  const editBtns = document.querySelectorAll(".editBtn");
  for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].onclick = function() {
      const id = this.getAttribute("data-id");
      openEditBox(id);
    };
  }

 
  const delBtns = document.querySelectorAll(".delBtn");
  for (let i = 0; i < delBtns.length; i++) {
    delBtns[i].onclick = function() {
      const id = this.getAttribute("data-id");
      delUser(id);
    };
  }
}

 
btn1.onclick = function() {
  if (box1.style.display === "flex") {
    box1.style.display = "none";
  } else {
    box1.style.display = "flex";
  }
};

 
btn2.onclick = function() {
  const n = document.getElementById("name").value.trim();
  const p = document.getElementById("price").value.trim();
  const d = document.getElementById("description").value.trim();
  const i = document.getElementById("image").value.trim();

  if (n == "" || p == "" || d == "" || i == "") {
    alert("Barcha maydonlarni toldiring!");
    return;
  }

  const newUser = {
    name: n,
    price: p,
    description: d,
    image: i
  };

  fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  })
    .then(function() {
      box1.style.display = "none";
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("description").value = "";
      document.getElementById("image").value = "";
      getAll();
    })
    .catch(function(err) {
      console.log("ADD:", err);
    });
};

 
function delUser(id) {
  fetch(api + "/" + id, {
    method: "DELETE"
  })
    .then(function() {
      getAll();
    })
    .catch(function(err) {
      console.log("DEL:", err);
    });
}

 
function openEditBox(id) {
  const item = allData.find(function(el) {
    return el.id == id;
  });

  if (!item) {
    return;
  }

  if (editBox) {
    editBox.remove();
  }

  editBox = document.createElement("div");
  editBox.className = "editBox";
  editBox.innerHTML = `
    <div class="editContent">
      <h3>Edit Product</h3>
      <input id="editName" value="${item.name}" placeholder="Name">
      <input id="editPrice" value="${item.price || ""}" placeholder="Price">
      <input id="editDesc" value="${item.description || ""}" placeholder="Description">
      <input id="editImg" value="${item.image || ""}" placeholder="Image URL">
      <div class="btns">
        <button id="saveEdit">Save</button>
        <button id="cancelEdit">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(editBox);

  const cancelBtn = document.getElementById("cancelEdit");
  cancelBtn.onclick = function() {
    editBox.remove();
  };

  const saveBtn = document.getElementById("saveEdit");
  saveBtn.onclick = function() {
    const newName = document.getElementById("editName").value.trim();
    const newPrice = document.getElementById("editPrice").value.trim();
    const newDesc = document.getElementById("editDesc").value.trim();
    const newImg = document.getElementById("editImg").value.trim();

    const updatedUser = {
      name: newName,
      price: newPrice,
      description: newDesc,
      image: newImg
    };

    fetch(api + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    })
      .then(function() {
        editBox.remove();
        getAll();
      })
      .catch(function(err) {
        console.log("EDIT:", err);
      });
  };
}

 
btn3.onclick = function() {
  const val = inp1.value.trim();
  if (val === "") {
    showAll(allData);
  } else {
    const filtered = allData.filter(function(item) {
      return item.id.toString() === val;
    });
    showAll(filtered);
  }
};

 
getAll();
