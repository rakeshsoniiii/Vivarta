"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { client, urlFor } from '../../sanity';
import Link from "next/link";
import 'animate.css';
import AOS from "aos";
import "aos/dist/aos.css";

// Define the TeamMember interface
interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  domain: string;
  image: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  featured: boolean;
}

function Team() {
  const teams: TeamMember[] = [
    // Management Leads
    {
      _id: '1',
      name: 'SHRUTI SHRIVASTAVA',
      designation: 'Management Lead',
      domain: 'Management',
      image: '/Shruti Shrivastava.JPEG',
      instagram: 'https://www.instagram.com/shrutishri04?utm_source=qr&igsh=NGZmd2JxbGxpaG44',
      linkedin: 'https://www.linkedin.com/in/shruti-shrivastava-a10774288/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      featured: true,
    },
    {
      _id: '3',
      name: 'HREETAM SENGUPTA',
      designation: 'Management Lead',
      domain: 'Management',
      image: '/Hreetam Sengupta.JPEG',
      linkedin: 'https://www.linkedin.com/in/hreetam-sengupta-122739373/',
      instagram: 'https://www.instagram.com/_hreetam_07?igsh=MWl6Y240YTEzeGVidg%3D%3D',
      featured: true,
    },
    {
      _id: '4',
      name: 'DIVYANSHI PRIYA',
      designation: 'Management Lead',
      domain: 'Management',
      image: '/DIVYANSHI PRIYA.jpeg',
      instagram: 'https://www.instagram.com/divyanshi_kaushik?igsh=MW5ldHVkY3ExMDE3cQ%3D%3D',
      linkedin: 'https://www.linkedin.com/in/divyanshi-priya-730a6727b/',
      featured: true,
    },
    {
      _id: '5',
      name: 'ARYAN CHETTRI',
      designation: 'Management Lead',
      domain: 'Management',
      image: '/ARYAN CHETTRI.JPEG',
      featured: true,
      linkedin: 'https://www.linkedin.com/in/your1copywriter/',
      instagram: 'https://www.instagram.com/_.chettri_/'
    },

    // Executive Leads
    {
      _id: '6',
      name: 'VIKASH KUMAR SAHU',
      designation: 'Executive Lead',
      domain: 'Executive',
      image: '/VIKASH KUMAR SAHU.JPEG',
      linkedin: 'https://www.linkedin.com/in/vikash-kumar-sahu-379240320/',
      instagram: 'https://www.instagram.com/vikashkumarsahu_?igsh=MWg5aXd2bXd0MjVkbg%3D%3D/',
      featured: false,
    },
    {
      _id: '7',
      name: 'ISTUTI SHARMA',
      designation: 'Executive Lead',
      domain: 'Executive',
      image: '/ISTUTI SHARMA.JPEG',
      instagram: 'https://www.instagram.com/istuti_25_11?igsh=aGs1NzF4ZGs0NmI5',
      featured: false,
    },

    // Domain Leads - Robotics
    {
      _id: '9',
      name: 'RAKESH SONI',
      designation: 'Robotics Lead',
      domain: 'Robotics',
      image: '/RAKESH SONI.JPG',
      instagram: 'https://www.instagram.com/rakeshsoniiii/',
      linkedin: 'https://www.linkedin.com/in/rakeshsoniiii/',
      featured: false,
    },
    
    {
      _id: '19',
      name: 'SHIBAM JOARDAR',
      designation: 'Point of Contact',
      domain: 'Robotics',
      image: '/SHIBAM JOARDAR.jpeg',
      linkedin: '',
      instagram: 'https://www.instagram.com/shibamjoardar?igsh=MWdnbW9wdTljdW9uOQ%3D%3D',
      featured: false,
    },

    // Domain Leads - Fun Events
    {
      _id: '10',
      name: 'DHRITIMAN SARKAR',
      designation: 'Domain Lead',
      domain: 'Fun Events',
      image: '/DHRITIMAN SARKAR.jpeg',
      linkedin: 'https://www.linkedin.com/authwall?trk=bf&trkInfo=AQH0HC9f0_FA5wAAAZ0Kh9-QadTxnkCS14uGizSlhhR4f4KeBMlKin9ycUUg35I1308U5K4vtQrixPgwbVNuArpg8PQI4zJMWGxcshr7LAcviBblPuGZvLKcCGBDrglbzaldtl0=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fdhritiman-sarkar-7861032b4%3Futm_source%3Dshare%26utm_campaign%3Dshare_via%26utm_content%3Dprofile%26utm_medium%3Dandroid_app',
      instagram: 'https://www.instagram.com/dhriti2342?igsh=d3BvZWhua3JwZ21n',

      featured: false,
    },
    {
      _id: '11',
      name: 'KRISHNA GOPAL BARIK',
      designation: 'Domain Lead',
      domain: 'Fun Events',
      image: '/KRISHNA GOPAL BARIK.jpeg',
      instagram: 'https://www.instagram.com/itz_krishna.x03?igsh=MTU3ZTVpZ3A2bjZtdg%3D%3D',
      featured: false,
    },

    // Domain Leads - Gaming
    {
      _id: '12',
      name: 'SHRAYAN MISHRA',
      designation: 'Domain Lead',
      domain: 'Gaming',
      image: '/SHRAYAN MISHRA.jpeg',
      instagram: 'https://www.instagram.com/shrayan._.music?igsh=aWIzMGc3dnNhYm1o',
      featured: false,
    },
    {
      _id: '13',
      name: 'SUPRODIPTO DAS',
      designation: 'Domain Lead',
      domain: 'Gaming',
      image: '/Suprodipto Das.jpeg',
      instagram: 'https://www.instagram.com/sup_is_pro?igsh=MTFibjF4NW01aDFqZg%3D%3D',
      featured: false,
    },

    // Domain Leads - Innovation and Management
    {
      _id: '14',
      name: 'SHAMARTHI BASU',
      designation: 'Domain Lead',
      domain: 'Innovation and Management',
      image: '/SHAMARTHI BASU.jpeg',
      linkedin: '',
      instagram: 'https://www.instagram.com/_shamarthi_?igsh=ZTAzb3oxMHhqNjRr',
      featured: false,
    },
    {
      _id: '15',
      name: 'KHUSHI KUMARI',
      designation: 'Point of Contact',
      domain: 'Innovation and Management',
      image: '/KHUSHI KUMARI.jpeg',
      instagram: 'https://www.instagram.com/khushi.__.s?igsh=aTU1N2ZpbGx0YmZ6',
      featured: false,
    },

    // Domain Leads - Mechmania
    {
      _id: '16',
      name: 'DEBJIT PAUL',
      designation: 'Domain Lead',
      domain: 'Mechmania',
      image: '/Debjit Paul.jpeg',
      instagram: 'https://www.instagram.com/_pdeb.9304?igsh=MTl1dmJxaHdpN3NtaQ%3D%3D',
      featured: false,
    },
    {
      _id: '17',
      name: 'ARUNANGSHU HALDER',
      designation: 'Point of Contact',
      domain: 'Mechmania',
      image: '/ARUNANGSHU HALDER.jpeg',
      instagram: 'https://www.instagram.com/_mr_greyyy?igsh=MXFsYmdzMmkzeTVxMg%3D%3D',
      featured: false,
    },

    // Domain Leads - Designing
    {
      _id: '20',
      name: 'ZAYDAN ASAD',
      designation: 'Point of Contact',
      domain: 'Designing',
      image: '/Zaydan Asad.jpeg',
      instagram: 'https://www.instagram.com/jet__skiii?igsh=c21hemV6MTRhb3I0',
      featured: false,
    },
    {
      _id: '20.1',
      name: 'SAYAK PAUL',
      designation: 'Point of Contact',
      domain: 'Designing',
      image: '/SAYAK PAUL.jpeg',
      instagram: 'https://www.instagram.com/alor_filament_?igsh=YzN3c3NvODlnemNy',
      featured: false,
    },

    // Domain Leads - Public & Relations
    {
      _id: '21',
      name: 'SHREYOSEE DHAR',
      designation: 'Domain Lead',
      domain: 'Public & Relations',
      image: '/Shreyosee.jpg',
      instagram: 'https://www.instagram.com/paintmyclouds?igsh=Y2Z1NHdjZTVjZm15',
      featured: false,
    },
    {
      _id: '21.1',
      name: 'RAUNAK DUTTA',
      designation: 'Point of Contact',
      domain: 'Public & Relations',
      image: '/RAUNAK DUTTA.jpeg',
      instagram: 'https://www.instagram.com/raunak_dutta10?igsh=OTdweW11Mzh3OWc0',
      featured: false,
    },

    // Domain Leads - Computing 
    
    {
      _id: '25',
      name: 'ADARSH GUPTA',
      designation: 'Point of Contact',
      domain: 'Computing',
      image: '/ADARSH GUPTA.jpeg',
      instagram: 'https://www.instagram.com/aaryan._.khan?igsh=M2JmZjNjZDk4YQ%3D%3D',
      featured: false,
    },
   
  ];

  const CoreTeams: TeamMember[] = [
    {
      _id: '21',
      name: 'OLIVIA SAHA',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Olivia Saha.jpeg',
      instagram: 'https://www.instagram.com/olivia_saha_03?igsh=MXF5NnV0ejR5bm41ZQ%3D%3D',
      featured: false,
    },
    {
      _id: '22',
      name: 'DEBASISH CHOWDHURY',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Debasish Chowdhury.jpeg',
      instagram: 'https://www.instagram.com/debasish.chowdhury.3367174?igsh=ejhzeHRod2M4ZHdk',
      featured: false,
    },
    {
      _id: '23',
      name: 'RAJ KUMAR',
      designation: 'Member',
      domain: 'Core Team',
      image: '/RAJ KUMARR.jpeg',
      instagram: "https://www.instagram.com/raaaaj.k?igsh=Z2YwNzAya3h4bDFv",
      featured: false,
    },
    {
      _id: '24',
      name: 'Asmita Mallick',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Asmita.jpg',
      featured: false,
    },
    {
      _id: '26',
      name: 'Animesh Maity',
      designation: 'Member',
      domain: 'Core Team',
      image: '/animesh.jpg',
      featured: false,
    },
    {
      _id: '28',
      name: 'Anirban Mallick',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Ani.JPG',
      featured: false,
    },
    {
      _id: '29',
      name: 'Anuhya Bose',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Anuhya.JPG',
      featured: false,
    },
    {
      _id: '30',
      name: 'Joydwipta Basak',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Joydwipta.jpg',
      featured: false,
    },
    {
      _id: '33',
      name: 'Subhadeep Mondal',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Subhodeep.jpg',
      featured: false,
    },
    {
      _id: '34',
      name: 'Aditya Chowdhury',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Aditya.jpg',
      featured: false,
    },
    {
      _id: '35',
      name: 'Sandipto Das',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Sandipto.jpg',
      linkedin: 'https://www.linkedin.com/in/sandipto-das-1bbb191b8',
      instagram: 'https://www.instagram.com/the_menacing_mind?igsh=MWIzd3hzdHBtYmlrNg==',
      featured: false,
    },
    {
      _id: '36',
      name: 'Anushmita Saha',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Anushmita.jpg',
      featured: false,
    },
    {
      _id: '37',
      name: 'Rani Bhattacharya',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Rani .jpg',
      featured: false,
    },
    {
      _id: '38',
      name: 'Adwitiya Santra',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Adwitiya .jpg',
      featured: false,
    },
    {
      _id: '39',
      name: 'Pritha Guha Thakurta',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Pritha.jpg',
      featured: false,
    },
    {
      _id: '40',
      name: 'Soumyadeep Saha',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Soumyadeep.jpg',
      featured: false,
    },
    {
      _id: '41',
      name: 'Istuti Sharma',
      designation: 'Member',
      domain: 'Core Team',
      image: '/Istuti.jpeg',
      featured: false,
    },
  ];

  useEffect(() => {
    // Scroll animations for the team page (also works on mobile).
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
    })
  }, [])

  // Filter Management and Executive Leads
  const managementLeads = teams.filter(member => member.domain === 'Management');
  const executiveLeads = teams.filter(member => member.domain === 'Executive');
  
  // Filter all domain leads separately
  const roboticsLeads = teams.filter(member => member.domain === 'Robotics');
  const funEventsLeads = teams.filter(member => member.domain === 'Fun Events');
  const gamingLeads = teams.filter(member => member.domain === 'Gaming');
  const innovationAndManagementLeads = teams.filter(member => member.domain === 'Innovation and Management');
  const mechmaniaLeads = teams.filter(member => member.domain === 'Mechmania');
  const designingLeads = teams.filter(member => member.domain === 'Designing');
  const publicRelationsLeads = teams.filter(member => member.domain === 'Public & Relations');
  const computingLeads = teams.filter(member => member.domain === 'Computing');

  return (
    <div>
      <div className="background"></div>
      <section className="teams-section">
        <div className="container mx-auto pt-7">
          <div className="animate__animated animate__fadeInUp mb-9 max-w-[800px]">
            <h2 className="mb-6 text-3xl font-extrabold leading-tight">
              Team
            </h2>
            <p className="text-lg md:text-xl lg:text-xl">
              At the helm of Techno Vivarta, you&apos;ll find our invaluable core team — a dedicated group of individuals who serve as the driving force behind our community&apos;s growth and success. With a shared passion for technology and innovation, they provide the leadership and inspiration needed to navigate the ever-evolving tech landscape, ensuring that Techno Vivarta remains a thriving hub for aspiring technocrats and tech enthusiasts alike.
            </p>
          </div>
          
          <h3 className="mb-9 text-center text-3xl font-extrabold leading-tight" data-aos="fade-up" data-aos-duration="800">
            Meet our Leads
          </h3>

          {/* Management Leads Section */}
          <h4 className="mb-9 text-center text-xl font-extrabold leading-tight" data-aos="fade-right" data-aos-duration="800">
            Management Leads
          </h4>
          <div className="animate__animated animate__fadeIn team-row mb-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {managementLeads.map((teamMember) => (
                <Card
                  key={teamMember._id}
                  className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                  data-aos="fade-up"
                  data-aos-duration="900"
                >
                  <CardHeader>
                    <Image
                      src={teamMember.image}
                      alt={teamMember.name}
                      className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      width={200}
                      height={200}
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div>
                      <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                      <p className="text-sm text-gray-600">{teamMember.designation}</p>
                    </div>
                    <div className="mt-3 flex gap-3">
                      {teamMember.linkedin && (
                        <Link
                          href={teamMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedinIn size={20} />
                        </Link>
                      )}
                      {teamMember.facebook && (
                        <Link
                          href={teamMember.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebook size={20} />
                        </Link>
                      )}
                      {teamMember.instagram && (
                        <Link
                          href={teamMember.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram size={20} />
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Executive Leads Section */}
          <h4 className="mb-9 text-center text-xl font-extrabold leading-tight" data-aos="fade-left" data-aos-duration="800">
            Executive Leads
          </h4>
          <div className="animate__animated animate__fadeIn team-row mb-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {executiveLeads.map((teamMember) => (
                <Card
                  key={teamMember._id}
                  className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                  data-aos="zoom-in"
                  data-aos-duration="900"
                >
                  <CardHeader>
                    <Image
                      src={teamMember.image} 
                      alt={teamMember.name}
                      className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      width={200}
                      height={200}
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div>
                      <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                      <p className="text-sm text-gray-600">{teamMember.designation}</p>
                    </div>
                    <div className="mt-3 flex gap-3">
                      {teamMember.linkedin && (
                        <Link href={teamMember.linkedin}
                          target="_blank" rel="noopener noreferrer"
                        >
                          <FaLinkedinIn size={20} />
                        </Link>
                      )}
                      {teamMember.facebook && (
                        <Link href={teamMember.facebook}
                          target="_blank" rel="noopener noreferrer"
                        >
                          <FaFacebook size={20} />
                        </Link>
                      )}
                      {teamMember.instagram && (
                        <Link href={teamMember.instagram}
                          target="_blank" rel="noopener noreferrer">
                          <FaInstagram size={20} />
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Domain Leads Sections - Each domain separately */}
          <h4 className="mb-9 text-center text-xl font-extrabold leading-tight">Domain Leads</h4>
          
          {/* Robotics Section */}
          {roboticsLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-blue-600" data-aos="fade-right" data-aos-duration="800">Robotics</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {roboticsLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="fade-right"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Fun Events Section */}
          {funEventsLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-green-600" data-aos="fade-left" data-aos-duration="800">Fun Events</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {funEventsLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="fade-left"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Gaming Section */}
          {gamingLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-purple-600" data-aos="zoom-in" data-aos-duration="800">Gaming</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {gamingLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="fade-up-left"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Innovation and Management Section */}
          {innovationAndManagementLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-orange-600" data-aos="fade-up" data-aos-duration="800">Innovation and Management</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {innovationAndManagementLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="fade-up"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Mechmania Section */}
          {mechmaniaLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-red-600" data-aos="zoom-in" data-aos-duration="800">Mechmania</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {mechmaniaLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="zoom-in"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Designing Section */}
          {designingLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-pink-600" data-aos="fade-up-left" data-aos-duration="800">Designing</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {designingLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="fade-up-left"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Public & Relations Section */}
          {publicRelationsLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-teal-600" data-aos="zoom-in" data-aos-duration="800">Public & Relations</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {publicRelationsLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="zoom-in"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Computing Section */}
          {computingLeads.length > 0 && (
            <>
              <h5 className="mb-6 text-center text-lg font-bold text-blue-600" data-aos="fade-down" data-aos-duration="800">Computing</h5>
              <div className="animate__animated animate__fadeIn team-row mb-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {computingLeads.map((teamMember) => (
                    <Card
                      key={teamMember._id}
                      className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                      data-aos="fade-down"
                      data-aos-duration="900"
                    >
                      <CardHeader>
                        <Image
                          src={teamMember.image} 
                          alt={teamMember.name}
                          className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          width={200}
                          height={200}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div>
                          <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                          <p className="text-sm text-gray-600">{teamMember.designation}</p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          {teamMember.linkedin && (
                            <Link href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn size={20} />
                            </Link>
                          )}
                          {teamMember.instagram && (
                            <Link href={teamMember.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram size={20} />
                            </Link>

                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Core Team Section */}
          <h3 className="mb-9 text-center text-3xl font-extrabold leading-tight" data-aos="zoom-in" data-aos-duration="800">Meet our Core Team</h3>
          <div className="animate__animated animate__fadeIn team-row mb-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {CoreTeams.map((teamMember) => (
                <Card
                  key={teamMember._id}
                  className="flex flex-col items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                  data-aos="zoom-in"
                  data-aos-duration="900"
                >
                  <CardHeader>
                    <Image
                      src={teamMember.image} 
                      alt={teamMember.name}
                      className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.07] hover:rotate-2 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-[1.07] active:rotate-2 active:shadow-2xl active:shadow-cyan-500/20"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      width={200}
                      height={200}
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div>
                      <h4 className="text-lg font-semibold">{teamMember.name}</h4>
                      <p className="text-sm text-gray-600">{teamMember.designation} - {teamMember.domain}</p>
                    </div>
                    <div className="mt-3 flex gap-3">
                      {teamMember.linkedin && (
                        <Link href={teamMember.linkedin}
                          target="_blank" rel="noopener noreferrer"
                        >
                          <FaLinkedinIn size={20} />
                        </Link>
                      )}
                      {teamMember.facebook && (
                        <Link href={teamMember.facebook}
                          target="_blank" rel="noopener noreferrer"
                        >
                          <FaFacebook size={20} />
                        </Link>
                      )}
                      {teamMember.instagram && (
                        <Link href={teamMember.instagram}
                          target="_blank" rel="noopener noreferrer">
                          <FaInstagram size={20} />
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div> 
        </div>
      </section>
    </div>
  );
}

export default Team;
