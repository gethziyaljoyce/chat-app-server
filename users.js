const users = [];

//function to add new user to array
const addUser = ({ id, name, room }) => {
    //to remove extra spaces and make them to lowercase
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //to prevent user with same name
    const existingUser = users.find((user) => user.room === room && user.name === name);
    if(!name || !room) return {error:"username and room are required"};
    if (existingUser) {
        return { error: "UserName is already used" };
    }

    const user = { id, name, room };
    users.push(user);
    return { user }

}

//function to remove user from array
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

}

//function to find the user
const getUser = (id) => {
    users.find((user) => user.id === id);
}

//function to find the users of a room
const getUsersRoom = (room) => {
    users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersRoom };