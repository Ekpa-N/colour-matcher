"use client"
import Image from "next/image";
import ColourMatcher from "@/components/ColourMatcher";
import AppContext from "@/components/Provider";
import { ReactEventHandler, ReactHTMLElement } from "react";
import { useState } from "react";
import { db } from '../../firebase/index'
import { CSVLink } from "react-csv";
import { collection, addDoc, getDocs, limit, query, where, doc, updateDoc, setDoc, getDoc, startAt, startAfter, getCountFromServer, serverTimestamp, endBefore, onSnapshot } from "firebase/firestore";

export default function Registration() {
    const [formData, setFormData] = useState<{ name: string, center: string, phone: string, email:"" }>({ name: "", center: "", phone: "", email:"" })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [attendance, setAttendance] = useState<any>([])

    const headers = [
        { label: "Name", key: "name" },
        { label: "Center", key: "center" },
        { label: "Phone", key: "phone" },
    ]

    async function handleSubmit(e: any) {
        e.preventDefault()
        setIsLoading(true)
        await setDoc(doc(db, "registration", formData.phone), {
            name: formData.name,
            center: formData.center,
            phone: formData.phone,
            email: formData.email
        });

        setFormData({ name: "", center: "", phone: "", email: "" })
        setIsLoading(false)
    }

    function addSpaceEveryThreeCharacters(str: string) {
        let result = '';
        
        for (let i = 0; i < str.length; i++) {
          result += str[i];
          if ((i + 1) % 3 === 0 && i + 1 !== str.length) {
            result += ' ';
          }
        }
        
        return result;
      }

    async function download() {
        const querySnapshot = await getDocs(collection(db, "registration"));
        const data: any = []
        querySnapshot.forEach((doc) => {
            data.push({ name: doc.data().name, center: doc.data().center, phone: doc.data().phone })
        });
        setAttendance(data)
        // debugger      
    }

    function handleChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    return (
        <AppContext.Consumer>
            {({ defaultPattern, defaultPatterns, playerPatterns, makeSwitch, makeSwitchToo, playerOneSwitch, playerTwoSwitch, resetDefault, playerOnePattern, playerTwoPattern, playerOnePatternError }) => {
                return (
                    <main className="flex flex-col min-h-screen w-[100%] items-start justify-center gap-[20px] p-4">
                        <form className="flex w-[400px] border m-auto borde p-2 flex-col gap-[30px]">
                            <label htmlFor="name">NAME</label>
                            <input onChange={(e) => { handleChange(e) }} value={formData.name} name="name" className="outline-none border w-full" />
                            <label htmlFor="center">CENTER</label>
                            <input onChange={(e) => { handleChange(e) }} value={formData.center} name="center" className="outline-none border w-full" />
                            <label htmlFor="phone">PHONE</label>
                            <input onChange={(e) => { handleChange(e) }} value={formData.phone} name="phone" className="outline-none border w-full" />
                            <label htmlFor="phone">Email</label>
                            <input onChange={(e) => { handleChange(e) }} value={formData.email} name="email" className="outline-none border w-full" />
                            <button disabled={isLoading} className="border p-4 w-fit self-center rounded" onClick={(e) => { handleSubmit(e) }}>{isLoading ? "Uploading" : "Submit"}</button>
                        </form>
                        <CSVLink
                            filename="attendance.csv"
                            data={attendance}
                            headers={headers}
                            asyncOnClick={true}
                            onClick={async (event, done) => {
                                const querySnapshot = await getDocs(collection(db, "registration"));
                                const data: any = []
                                querySnapshot.forEach((doc) => {
                                    data.push({ name: doc.data().name, center: doc.data().center, phone: addSpaceEveryThreeCharacters(doc.data().phone.toString()) })
                                });
                                setAttendance(data)
                                done()
                            }}
                        >
                            <button className="border font-[600] p-2 rounded-[10px] border-[3px]">Download Attendance</button>
                        </CSVLink>
                    </main>
                )
            }}
        </AppContext.Consumer>
    )
}
