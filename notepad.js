const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["JAN","FEB","MAR","APR","MAY","JUNE","JULY","AUG","SEP","OCT","NOV","DEC"];
//getting localstorage notes if exist and parsing them
//to js object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]"); 
let isUpdate=false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value= "";
    descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showNotes(){
    if(!notes) return;
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note, index) => {
        let filterDesc = note.description.replaceAll("\n",'<br/>');
        let liTag=`<li class="note">
        <div class="details">
        <p>${note.title}</p>
        <span>${note.description}</span>
        </div>
        <div class="bottom-content">
        <span>${note.date}</span>
        <div class="settings">
        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
        <ul class="menu">
        <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
        <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
        </ul>
        </div>
        </div>
        </li>`;
        addBox.insertAdjacentHTML("afterend",liTag);
    });
}
showNotes();

function showMenu(elem){
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e =>{
        //removing show class from the settings emnu on document click
        if(e.tareget.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show");
        }
    });
}
function deleteNote(noteId){
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1); //removing selected note from array/tasks
    //saving updated notes to localstorage
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}
function updateNote(noteId, title, filterDesc){
    let description=filterDesc.replaceAll('<br/>','\r\n');
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value= title;
    descTag.value = description;
    addBtn.innerText="Update Note";
    popupTitle.innerText="Update a note";

}


addBtn.addEventListener("click", e =>{
    e.preventDefault();
    let noteTitle = titleTag.value,
    noteDesc = descTag.value;

    if(noteTitle || noteDesc){
        //getting month,day,year from the current date
        let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle, description: noteDesc,
            date: `${month} ${day}, ${year}`
        }
        if(!isUpdate)
        {
            notes.push(noteInfo);//adding new note to notes
        } 
        else{
            isUpdate = false;
            notes[updateId] = noteInfo; // updating specified note
        }
        //adding a new note to notes
        //saving notes to localstorage
        localStorage.setItem("notes",JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
});

//once note is updated, we've to set the isUpdate value to false beacuse when user try to add a new note, the previous updated note will be replaced by the new one. 

