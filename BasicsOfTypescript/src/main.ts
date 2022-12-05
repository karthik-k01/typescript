// const getFullName = (firstName: string, lastName: string): string => {
//     return firstName + " " + lastName
// }

// console.log(getFullName("James", "Cameron"))



// const user: {name: string, age:number} = {
//     name: "Kevin",
//     age: 25
// }


// const user2: {name: string, age:number} = {
//     name: "Levi"
// }

//-----------------------------------------------------------------------//
// interface UserInterface {
//     name: string,
//     age?: number //? indicates not mandatory
//     getMessage(): string
// }

// const user: UserInterface = {
//     name: "Kevin",
//     age: 25,
//     getMessage(){
//         return "Hello " + name; 
//     },
// }


// const user2: UserInterface = {
//     name: "Levi",
//     getMessage(){
//         return "Hello " + name; 
//     },
// }
//--------------------------------------------------------------------//

// type ID = string
// type popularTag = string
// type mayBePopularTag = string | null


// interface UserInterface{
//     id: ID;
//     name:string,
//     suurname: string,
// }

// const PopularTags: popularTag[] = ["filter", "coffee"]

// const dragonTag: mayBePopularTag = null
// let username: string = "Tom"
// let pageName: string | number = 5
// let errorMessae: string | null = null;
// let user: UserInterface | null = null 


//--------------------------------------------------------------------------------//

// const doSomething = (): void  => {
//     console.log("Do Something")
// }

// let unknown: void = undefined
// // unknown = "hi"     throws error

// let function1: any = "Hi"
// console.log(function1.noHi())

// const doSomething2 = (): never  => {
//     // console.log("Do Something")           A function with never can never be executed to the end
//     throw "never"
// }                                         

// let vAny: any = 10
// let vUnknown: unknown = 10

// // let s1: string = vAny     //We can assign any type to other types
// // let s2: string = vUnknown //Throws error that unknown is not able to assign to other types

// // console.log(vAny.randomMethod()) //Does not care for any methods

// // console.log(vUnknown.randomMethod()) //Throws error as the method does not exist


// let s2: string = vUnknown as string //type assertion is made using "as"

// //Assertion example
// let pageNumber: string = "1"
// // let numericPageNumber: number = pageNumber as number //throws error to first convert it into unknown and then to number

// let numericPageNumber: number = (pageNumber as unknown) as number

// let page: any = "1"
// let pageNumber = page as string //when we declare type as any we can use it for an of the types and no need to mention 'as' keyyword

//--------------------------------------------------------------------------------------------------------------------------------------//
// const someElement = document.querySelector('.foo') as HTMLInputElement//Typescript cannot detect markup, it can only detect datatypes

// // console.log('someElement', (someElement as any).value)         //Incorrect way of usin DOM

// console.log('someElement', someElement.value)  

//-------------------------------------------------------------------------------------------------------------------------------------//


// const someElement = document.querySelector('.foo')
// someElement.addEventListener('blur', (event) => {
//     const target = event.target as HTMLInputElement
//     console.log('event', event.target.value)
// })

//---------------------------------------------------------------------------------------------------------------//

// class User {
//     firstName: string
//     lastName: string

//     constructor (firstName: string, lastName: string){
//         this.firstName = firstName
//         this.lastName = lastName
//     }


//     getFullName(): string{
//         return this.firstName + ' ' + this.lastName
//     }
// }

// const user1 = new User("Mark", "Wood")
// console.log(user1.getFullName)               //Everything is default public if not mentioned

//------------------------------------------------------------------------------------------------------//

// interface UserInterface{
//     getFullName(): string
// }
// class User implements UserInterface{
//     private firstName: string
//     private lastName: string
//     readonly unchangeableName: string
//     static readonly maxAge = 50

//     constructor (firstName: string, lastName: string){
//         this.firstName = firstName
//         this.lastName = lastName
//         this.unchangeableName = firstName
//     }


//     getFullName(): string{
//         return this.firstName + ' ' + this.lastName
//     }

//     // unchangeableName(): void {
//     //     this.unchangeableName = this.firstName    //Cannot assign any value to it as it is a readonly property
//     // }
// }

// class Admin extends User{
//     private editor: string

//     setEdiitor (editor: string) : void{
//         this.editor = editor
//     }

//     getEditor(): string{
//         return this.editor
//     }
// }

// const user1 = new User("Mark", "Wood")
// console.log(user1.getFullName)       // Since we mentioned private for firstName and lastName, we cannot access it but we can take it from getFllName method
// console.log(User.maxAge) //static variables are for classes and not for objects

// const admin1 = new Admin("Glenn", "Maxwell")
// console.log(admin1.getFullName)   //Since admin class inherits from User class, it gets all properties from User

// console.log(admin1.getEditor)   //Now it has its own method + methods from User 
//---------------------------------------------------------------------------------------------------------------------------------//


// const addId = <T> (obj : T) => {
//     const id = Math.random().toString(16)
//     return{
//         ...obj,
//         id
//     }
// }

// interface UserInterface<T>{
//     name: String
//     data:T
// }


// const user: UserInterface <{meta : string}>= {
//     name: "Chris",
//     data: {
//         meta: "foo"
//     }
// }

// const user2: UserInterface<string[]>

// const result = addId<UserInterface>(user)
// console.log("result", result)

//-----------------------------------------------------------------------------------------------------------------//

enum Status{
    NotStarted,             //0
    InProgress,             //1
    Done                    //2
}

let notStartedStatus: Status = Status.NotStarted


console.log(Status.InProgress)         //logs 1