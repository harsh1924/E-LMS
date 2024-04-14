import { useState } from "react";
import { toast } from 'react-hot-toast';
import axiosInstance from "../Helpers/axiosInstance";
import Layout from "../Layout/Layout";

export default function Contact() {
    const [userInput, setUserInput] = useState({
        name: '',
        email: '',
        message: ''
    });

    // HANDLE INPUT CHANGE FUNCTION
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    };

    // FUNCTION TO SEND FORM DATA TO BACKEND
    const hanldeFormSubmit = async (event) => {
        event.preventDefault();
        if (!userInput.email || !userInput.name || !userInput.message) {
            toast.error('All fields are mandatory');
            return;
        }

        // EMAIL VALIDATION
        if (
            !userInput.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ) {
            toast.error("Invalid email id");
            return;
        }

        try {
            const res = axiosInstance.post('/contact', { userInput });
            toast.promise(res, {
                loading: 'Submitting Your Message...',
                success: 'Form Submitted Successfully',
                error: 'Failed to submit the form',
            });
            const response = await res;
            if (response?.data?.success) {
                setUserInput({
                    name: '',
                    email: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.error('Operation Failed');
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={hanldeFormSubmit}
                    className="flex flex-col items-center justify-center gap-2 p-5 rounded-md text-white shadow-[0_0_10px_black] w-[22rem]">
                    <h1 className="text-3xl font-semibold">Contact Form</h1>
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="name" className="text-xl font-semibold">Name</label>
                        <input type="text" className="border bg-transparent px-2 py-1 rounded-sm" id="name" name="name" placeholder="Enter your name" value={userInput.name} onChange={handleInputChange} />
                    </div>

<div className="flex flex-col w-full gap-1">
<label htmlFor="email" className="text-xl font-semibold">Email</label>    
<input type="text" className="border bg-transparent px-2 py-1 rounded-sm" id="email" name="email" placeholder="Enter your email" value={userInput.email} onChange={handleInputChange} />
</div>

<div className="flex flex-col w-full gap-1">
<label htmlFor="message" className="text-xl font-semibold">Message</label>
<textarea name="message" id="message" className="border bg-transparent px-2 py-1 rounded-sm resize-none h-40" placeholder="Enter your message" value={userInput.message}onChange={handleInputChange}>
</textarea>
</div>

<button className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer" type="submit">Submit</button>

                </form>
            </div>
        </Layout>
    )
}