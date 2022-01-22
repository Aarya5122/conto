import { 
    SET_CONTACTS, 
    SET_LOADING,
    VIEW_CONTACT,
    UPDATE_CONTACT
} from "./action.types";

const ContactReducer = (state, action) => {

    switch(action.type){
       case SET_LOADING:
           return {...state, isLoading: action.payload}
        case SET_CONTACTS:
            return action.payload === null ?
            {...state, contacts: []}
            :
            {...state, contacts: action.payload}
        case VIEW_CONTACT:
            return {...state, contact: action.payload}
        case UPDATE_CONTACT:
            return {
                ...state, 
                contactToUpdate: action.payload,
                contactToUpdateKey: action.key
            }
        default:
            return state
    }

}

export default ContactReducer;