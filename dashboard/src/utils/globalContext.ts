import React from "react";
const GlobalContext = React.createContext({
    count: 0,
    myStudents: null,
    teacherId: 0,
    teacher: {},
    update: (data) => {}
})

export default GlobalContext