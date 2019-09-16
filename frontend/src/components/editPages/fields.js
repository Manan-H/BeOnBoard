export default [
    { name: 'name', placeHolder: 'Name', type: "name", isRequired:true },
    { name: 'surname', placeHolder: 'Surname', type: "name", isRequired:true },
    { name: 'corpEmail', placeHolder: 'Corporate Email', type: "email", isRequired:true },
    { name: 'phoneNumber', placeHolder: 'Phone', type: "phoneNumber", isRequired:true },
    { name: 'birthday', placeHolder: 'Birthday', type: "Date" },
    { name: 'position', placeHolder: 'Position', type: "text", isRequired:true },
    { name: 'education', placeHolder: 'Education', type: "text" },
    { name: 'profPic', placeHolder: 'Profile Photo', type: "Photo" , isRequired: true},
    { name: 'professionalSkills', placeHolder: 'Professional Skills', type: "EditableTagGroup", tagName:"skill", isRequired:true },
    { name: 'hobbies', placeHolder: 'Hobbies & Interests', type: "EditableTagGroup", tagName:"hobbie", },
    { name: 'experience', placeHolder: 'Years of Experience', type: "smallNumber" },
    { name: 'social', placeHolder: 'Social Networks', type: "social" },
    { name: 'shortInfo', placeHolder: 'Fun Facts', type: "textarea" }
  ];