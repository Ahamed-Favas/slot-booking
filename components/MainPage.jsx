'use client'
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";

const rmUser = async (key, curr_user_phone, curr_user) => {
    try {
        await fetch('api/rmUser', { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, curr_user_phone, curr_user }) })
    } catch (error) {
        console.log(error)
    }
};
const AddUser = async (key, curr_user_phone, curr_user) => {
    try {
        await fetch('api/addUser', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, curr_user_phone, curr_user })
        });
    } catch (error) {
        console.log(error);
    }
};
function MainPage({ initialData }) {
    const [jobs, setJobs] = useState(initialData);
    const { data: session, status } = useSession()

    useEffect(() => {

        const channel = pusherClient.subscribe('work_channel');

        const handleUserEnrolled = (data) => {
            updateJobs([data.work]);
        };

        const handleApplicantDeleted = (data) => {
            updateJobs([data.work]);
        };
        const updateJobs = (newJob) => {
            const updatedJobs = [...jobs]
            let jobIndex = -1
            updatedJobs.forEach((obj, index) => {if(obj._id === newJob[0]._id){jobIndex = index}})
            updatedJobs[jobIndex] = newJob[0]
            setJobs(updatedJobs);
        };
        
        channel.bind('user_enrolled', handleUserEnrolled);
        channel.bind('applicant_deleted', handleApplicantDeleted);

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        };

    }, [jobs]);
    
    const curr_user = session?.user?.name;
    const curr_user_phone = session?.user?.email

    const isArrayPresent = (arr, target) => {
        if(arr){
        return arr.some(item => JSON.stringify(item) === JSON.stringify(target))}
        else{
            return
        }
    }

    const handleApply = async (index, key, check, vacancy, selectedDateTime_raw) => {
        try {
            const currentDateTime = new Date();
            const selectedDateTime = new Date(selectedDateTime_raw);
            if (selectedDateTime < currentDateTime) {
                alert("Work finished");
                return;
            }
            if (check && (currentDateTime.getTime() > selectedDateTime.getTime() - (10 * 60 * 60 * 1000)))
            {
                alert("Can't leave now, contact Captain")
                return
            }
            const total_applicants = jobs[index].applicants.length
            if (total_applicants >= vacancy && !check) {
                alert("Vacancy exceeded")
                return
            }
            if (check) {
                if (confirm("Do you want to withdraw?")) {
                    await rmUser(key, curr_user_phone, curr_user)
                    return
                }
                return
            }
            await AddUser(key, curr_user_phone, curr_user);
        } catch (error) {
            console.log(error);
        }
    };

    return (
<div>
    <nav className="flex justify-end items-center mb-4">
        <Link className="underline mr-4 text-sm" href={'/admin'}>Add Event</Link>
        <button className="bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-1 hover:bg-gray-800" onClick={() => signOut()}>Sign Out</button>
    </nav>

    {status === 'loading' ? (
    <div className="text-center">Loading...</div>
    ) : (<>
    {jobs.map((t, index) => (
        <div key={t._id} className="mb-6">
            <div className='shadow-2xl p-5 rounded-sm space-y-6'>
                <div>
                    <h1 className="text-xl mb-2 grid place-items-center w-full">{t.date_time}</h1>
                    <br />
                    <p className="text-lg mb-2 ml-2">Location - {t.location}</p>
                    {t.captain && <p className="text-lg mb-2 ml-2">Captain - {t.captain}</p>}
                    {t.vacancy && <p className="text-lg mb-2 ml-2">Vacancy - {t.vacancy}</p>}
                    {(t.applicants.length> 0) && <h2 className="text-2xl mb-1 ml-2">Boys</h2>}
                    {t.applicants && t.applicants.map((applicant, index) => (
                        <div key={index} className="text-lg  ml-2">
                            <span>{index + 1}. {applicant[1]} - {applicant[0]}</span>
                        </div>
                    ))}

                    <button className={`bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-1 mt-2 w-full hover:bg-gray-800 `} onClick={() => handleApply(index, t._id, isArrayPresent(t.applicants, [curr_user_phone, curr_user]), t.vacancy, t.date_time_raw)}>
                        {isArrayPresent(t.applicants, [curr_user_phone, curr_user]) ? "Leave" : "Apply"}
                    </button>
                    <div style={{ textAlign: 'right' }}>{isArrayPresent(t.applicants, [curr_user_phone, curr_user]) ? 
                        <p className="text-md mt-2 mr-2">*can&apos;t leave before 10hrs</p> : <></>}
                    </div>
                </div>
            </div>
        </div>
    ))}</>)}
</div>

    );
}

export default MainPage;
