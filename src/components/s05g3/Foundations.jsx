import Gallery from './Gallery.jsx';
import darpa from '../../assets/s05g3/darpa.webp';
import wideArea from '../../assets/s05g3/arpanet.webp';
import msg from '../../assets/s05g3/message.webp';
import email from '../../assets/s05g3/email.webp';

const milestones = [
  {
    year: '1958',
    title: 'DARPA Founded',
    img: darpa,
    desc: 'In response to the Soviet Union\'s launch of Sputnik, the U.S. Department of Defense established the Advanced Research Projects Agency (DARPA) to fund high-risk, high-reward scientific research. Its Information Processing Techniques Office would later fund the network experiments that became ARPANET.'
  },
  {
    year: '1965',
    title: 'First Wide-Area Network Experiment',
    img: wideArea,
    desc: 'Researcher Lawrence Roberts connected a computer in Massachusetts to one in California over a dedicated phone line, creating the first wide-area computer network. The experiment proved computers could share data over long distances, but also revealed that circuit-switched telephone lines were inefficient for this purpose.'
  },
  {
    year: '1969',
    title: 'First ARPANET Message',
    img: msg,
    desc: 'On October 29, a computer at UCLA attempted to send the word "LOGIN" to a computer at Stanford Research Institute over the newly built ARPANET. The system crashed after transmitting just "LO" — but the connection had been made, marking the first message ever sent over a packet-switched network.'
  },
  {
    year: '1971',
    title: 'The First Email',
    img: email,
    desc: 'Engineer Ray Tomlinson sent the first network email between two computers sitting side by side at BBN Technologies. He introduced the "@" symbol to separate a user\'s name from their host machine — a convention still used in every email address today.'
  },
];

// Foundation.jsx
export default function Foundation() {
  return <Gallery title="Origins" subtitle="Gallery I · 1958–1971" milestones={milestones} accent="#f59e0b" />;
}