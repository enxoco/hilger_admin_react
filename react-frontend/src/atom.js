import { atom } from "recoil"

export const teachers = atom({
  key: "teachers",
  default: null,
})

export const parents = atom({
  key: "parents",
  default: null,
})


export const students = atom({
  key: "students",
  default: null,
})

export const searchTerm = atom({
  key: "searchTerm",
  default: "",
})

export const loggedInUser = atom({
  key: "loggedInUser",
  default: null,
})

export const studentCount = atom({
  key: "studentCount",
  default: 0,
})

export const fetchCourses = atom({
  key: "fetchCourses",
  default: false,
})

export const courses = atom({
  key: "courses",
  default: {id: null, name: "", grade: ""},
})

export const pageSize = atom({
  key: "pageSize",
  default: 50
})

export const pageOffset = atom({
  key: "pageOffset",
  default: 0
})

export const impersonateUser = atom({
  key: "impersonate",
  default: null
})