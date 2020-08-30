//Constants from index.html
const TaskList = document.querySelector('#task-list'); //list of items
const form = document.querySelector('#add-task-form') //Form

//Display data (run for each document in firestore)
function renderTasks(doc) {
    //Create HTML tags to use 
    let li = document.createElement('li');
    let name = document.createElement('span');
    let time = document.createElement('span');

    //Create x for deletion 
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id); //Set ID

    //Fill text element of spans
    name.textContent = doc.data().name;
    time.textContent = doc.data().time;
    cross.textContent = 'x';

    //Add new spans to new li
    li.appendChild(name);
    li.appendChild(time);
    li.appendChild(cross);

    //Add new li to the cafe list (ul from index.html)
    TaskList.appendChild(li);

    //To delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        //Get document ID from element (used as a reference in firestore)
        let id = e.target.parentElement.getAttribute('data-id');

        db.collection('tasks').doc(id).delete(); //Removes element from database
    })
}

//Code for a query instead of simple get (replace below)
//db.collection('cafes').where('city', '==', 'Derby').get().then((snapshot) => {

//Get data in alphabetical order by name
// db.collection('cafes').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });


//Code to update a name: (use set instead of update to reset entire thing ie. would delete city as no new value given)
// db.collection('cafes').doc('ID FROM FIRESTORE').update({
//     name: 'New Name'
// })

//Save data (add cafe) on button press
form.addEventListener('submit', (e) => {
    e.preventDefault(); //Stops automatic refresh on button press
    //Add to firebase db using values from form
    db.collection('tasks').add({
        name: form.name.value,
        time: form.time.value
    })
    //Clear input boxes on form
    form.name.value = '';
    form.time.value = '';
})

//Listener (fore real-time updating)
db.collection('tasks').onSnapshot(snapshot => {
    //Gets differences between firestore db and current data
    let changes = snapshot.docChanges();
    changes.forEach(change => { //For each change
        if (change.type == 'added') { //If new data, render it to display
            renderTasks(change.doc);
        } else if (change.type == 'removed') { //If data has been deleted
            //Select the correct li using the document id from firestore db
            console.log('[data-id=' + change.doc.id + ']');
            let li = TaskList.querySelector('[data-id=' + change.doc.id + ']');
            TaskList.removeChild(li); //Remove from list
        }
    })
})