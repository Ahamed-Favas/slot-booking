'use client'
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const getWorks = async (setJobs, setLoading) => {
    try {
        const jobs_res = await fetch('api/getWork');
        const { works } = await jobs_res.json();
        if (works) {
            setLoading(false);
            setJobs(works.slice().reverse());
        }
    } catch (error) {
        console.log(error);
    }
};
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

function MainPage() {
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        // Call getWorks with setJobs as argument
        getWorks(setJobs, setLoading);
    }, []);
    const { data: session } = useSession();
    const curr_user = session?.user?.name;
    const curr_user_phone = session?.user?.email

    const isArrayPresent = (arr, target) => {
        return arr.some(item => JSON.stringify(item) === JSON.stringify(target))
    }

    const handleApply = async (index, key, check, vacancy, selectedDateTime_raw) => {
        try {
            const currentDateTime = new Date();
            const selectedDateTime = new Date(selectedDateTime_raw);
            if (selectedDateTime < currentDateTime) {
                alert("Work finished");
                return;
            }
            const total_applicants = [...jobs][index].applicants.length
            if (total_applicants >= vacancy && !check) {
                alert("Vacancy exceeded")
                return
            }
            if (check) {
                if (confirm("Do you want to withdraw")) {
                    const updatedJobs = [...jobs];
                    await rmUser(key, curr_user_phone, curr_user)
                    updatedJobs[index].applicants = updatedJobs[index].applicants.filter(applicant => {
                        return JSON.stringify(applicant) !== JSON.stringify([curr_user_phone, curr_user]);
                    });
                    setJobs(updatedJobs);
                    return
                }
                return
            }
            const updatedJobs = [...jobs];
            await AddUser(key, curr_user_phone, curr_user);
            updatedJobs[index].applicants.push([curr_user_phone, curr_user]);
            setJobs(updatedJobs);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <nav>
                <Link className="underline text-right text-sm mt-0" href={'/admin'}>Add Event</Link>
                <br />
                <button className="bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-0.5" onClick={() => signOut()}>Sign Out</button>
            </nav>
            {loading && (<div>loading...</div>)}
            {jobs.map((t, index) => (
                <div key={t._id}>
                    <div className='shadow-lg p-5 rounded-sm space-y-6'>
                        <div>
                            <h1 className="text-2xl">Work Details</h1>
                            <span className="text-2xl">Date - {t.date_time}</span>
                            <br />
                            <span className="text-2xl">Location - {t.location}</span>
                            <br />
                            <span className="text-2xl">Captain - {t.captain}</span>
                            <br />
                            <span className="text-2xl">Vacancy - {t.vacancy}</span>
                            <br />
                            <br />
                            <h2 className="text-2xl">Boys</h2>
                            {t.applicants.map((applicant, index) => (
                                <div key={index}>
                                    <span key={index} className="text-2xl">{index + 1}. {applicant[1]} - {applicant[0]} </span>
                                    <br />
                                </div>
                            ))}
                            <br />
                            <button className="bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-0.5" onClick={() => handleApply(index, t._id, isArrayPresent(t.applicants, [curr_user_phone, curr_user]), t.vacancy, t.date_time_raw)}>
                                {isArrayPresent(t.applicants, [curr_user_phone, curr_user]) ? "Applied" : "Apply"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MainPage;
