import React from 'react';
import { CgProfile} from 'react-icons/cg';
import {BsClockFill} from 'react-icons/bs';
import {MdOutlineWorkHistory} from 'react-icons/md';
import {GoSignOut} from 'react-icons/go';
import {BsEnvelopeCheck} from 'react-icons/bs'

export const links =[
    {
        title: 'Leave Management',
       links:[{ name: 'Leave Application Form',
       icon: <BsClockFill />
    },
],
    },

    { 
    title: 'Complaint Management',
    links: [{name:'Complaint Form',
    icon: <BsClockFill />}]
        
    },
    // {
    //     name: 'Leave History',
    //     icon: <MdOutlineWorkHistory />
    // },
    // {
    //     name: 'Leave Acknowledgement',
    //     icon: <BsEnvelopeCheck />
    // },
    // {
    //     name: 'Sign Out',
    //     icon: <GoSignOut/>
    // }
]