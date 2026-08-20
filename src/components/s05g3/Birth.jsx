import Gallery from './Gallery.jsx';
import Birth1 from '../../assets/s05g3/Birth1.webp';
import Birth2 from '../../assets/s05g3/Birth2.webp';

const milestones = [
  {
    year: '1990',
    title: 'WWW was Born / ARPANET Shutdown',
    img: Birth1,
    desc: 'Tim Berners-Lee, working at CERN, developed the foundational technologies of the World Wide Web: HTML for structuring pages, HTTP for transferring them, and URLs for addressing them, along with the first web browser and server. That same year, ARPANET was officially decommissioned, its functions fully absorbed by the broader Internet.'
  },
  {
    year: '1991',
    title: 'WWW Introduced to the Public',
    img: Birth2,
    desc: 'Tim Berners-Lee publicly announced the World Wide Web on the alt.hypertext newsgroup, making the project available to anyone connected to the Internet. This opened the door for anyone to create and browse web pages, marking the true beginning of the modern web.'
  },
];

export default function Birth() {
  return <Gallery title="The Birth of the Public Web" subtitle="Gallery III · 1990–1991" milestones={milestones} accent="#a855f7" />;
}