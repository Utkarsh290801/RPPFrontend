import { faMobileAlt, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { faBuffer } from "@fortawesome/free-brands-svg-icons";

export const usefulLink = [
  { name: "Home", id: 1, link: "#" },
  { name: "About us", id: 2, link: "/user/about" },
  { name: "Services", id: 3 ,link:"/user/service"},
  { name: "Team", id: 4,link: "https://rightpathpredictor.in/about"  },
//   { name: "Blog", id: 5 },
];
export const ourServices = [
//   { name: "Strategy & Research", id: 6 },
//   { name: "Web Design", id: 7 },
  { name: "Web Development", id: 8 },
  { name: "Digital Marketing", id: 9 },
  { name: "App Development", id: 10 },
];
export const otherLinks = [
  { name: "FAQ", id: 11,link:"/user/faq" },
//   { name: "RPP", id: 13 },
  { name: "Admin Login", id: 12, link: "/admin/addservice" },
//   { name: "Terms & Conditions", id: 14 },
  { name: "Support", id: 15 ,link:"/user/contact"},
];

export const footerInfo = [
  { info1: "Right Path Predictor Pvt. Ltd.", id: 1 },
  {
    icon: faMobileAlt,
    info1: "+91 7275459492",
    info2: "rightpathpredictor@gmail.com",
    id: 2,
  },
  {
    icon: faMapMarkedAlt,
    info1: "Plot No. 42, Gate no. 462 Navi Kot Nandana",
    info2: " Lucknow, Uttar Pradesh, INDIA 226201",
    id: 3,
  },
];
