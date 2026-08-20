import React, { useState, useRef, useEffect } from 'react';

const VennDiagram = () => {
    const [isVisible, setVisibility] = useState(false);

    const modalRef = useRef(null);

    // Bind modal element to the ref on mount (retrying if it's not ready immediately)
    useEffect(() => {
        let timer;
        const findModal = () => {
            const el = document.getElementById('venn-modal');
            if (el) {
                modalRef.current = el;
                console.log('Successfully hooked into external #venn-modal');
            } else {
                timer = setTimeout(findModal, 100);
            }
        };
        findModal();
        return () => clearTimeout(timer);
    }, []); 


    const handleClick = (element, title) => {
        // yes this is unsafe.
        // no I will not fix it.
        const htmlContent = element.getElementsByClassName("point-details")[0].children
        window.dispatchEvent(new CustomEvent('openModal', { detail: { target: element, title: title } }))
    };

    return (
        <div className="venn-container">
            <div className="circle linux-circle">
                <div 
                    className="venn-point outer-point l-pos-1"
                    onClick={(e) => handleClick(e.currentTarget, 'Kernel Only')}
                >
                    Kernel Only
                    <div className="point-details">
                        <p>Linux on its own is technically only a kernel, which is only really one part of a whole operating system (Prakash, 2023).</p>
                        <p>The kernel functions somewhat like the heart of the operating system, managing the various processes and resources the operating system needs in order to run (Geeks For Geeks, 2026).</p>
                        <p>There are a variety of operating systems built on the Linux kernel, such as Debian, Red Hat, or Arch, which we refer to as Linux distributions or distros for short.</p>
                    </div>
                </div>

                <div 
                    className="venn-point outer-point l-pos-2"
                    onClick={(e) => handleClick(e.currentTarget, 'GPL License')}
                >
                    GPL License
                    <div className="point-details">
                        <p>Linux is largely distributed under the GNU General Public License (GPL). This license allows any user to freely run, view, modify, and share the code. This means that you can download most Linux distributions, install whatever you want with it, and even distribute modified versions of them (Linux Vox, 2026).</p>
                        <p>However, GPL is a copyleft license, meaning that when distributing these modified versions, they must also be released under the same license and remain freely viewable and modifiable (Linux Vox, 2026).</p>
                    </div>
                </div>

                <div 
                    className="venn-point outer-point l-pos-3"
                    onClick={(e) => handleClick(e.currentTarget, 'Fragmented Ecosystem')}
                >
                    Fragmented Ecosystem
                    <div className="point-details">
                        <p>Due to the very open nature of Linux, there is no one single unified operating system to rule them all. Instead, its ecosystem can be divided among different types of Linux distributions (Taylor, 2025).</p>
                        <p>Each distribution has its own package managers i.e. apt for Ubuntu, dnf for Fedora, and pacman for Arch, but there are also decentralized forms of package distribution such as Flatpak and AppImages.</p>
                        <p>But with how different any two Linux distributions can be, there isn’t always a guarantee that what works on one system will seamlessly work on another.</p>
                    </div>
                </div>

                <div 
                    className="venn-point outer-point l-pos-4"
                    onClick={(e) => handleClick(e.currentTarget, 'Cgroups & Chroot')}
                >
                    Cgroups & Chroot
                    <div className="point-details">
                        <p>Linux does not have a one-to-one equivalent feature to FreeBSD jails, but it does have features that can serve a similar purpose. Linux cgroups are a feature that limits the resources that a program or group of programs can consume (Mosyan, 2026), while chroot can allow a user to change the root directory of a running process, effectively isolating it to that new root environment (Linux Vox, 2026).</p>
                        <p>Chroot, however, is not inherently a security feature and does not fully isolate a process like jails in FreeBSD as it is a filesystem isolation only, so processes, user accounts, and even the network trace of the host system may still be visible within the chroot (Linux Vox, 2026).</p>
                    </div>
                </div>
            </div>

            <div className="intersection" style={{ position: 'absolute', zIndex: 10, width: '320px', textAlign: 'center' }}>
                <div 
                    className="venn-point"
                    onClick={(e) => handleClick(e.currentTarget, 'Unix-Based')}
                >
                    Unix-Based
                    <div className="point-details">
                        <p>Both Linux and FreeBSD appear similar on the surface in part because their designs are derived from the original UNIX operating system. This means that they ultimately share a number of similarities in their implementation and design philosophies.</p>
                        <p>They have a modular design, have a similar file hierarchy, and even similar commands such as cd (change directory) or ls (list files) (Linux Vox, 2025). Additionally, they both adhere to the Portable Operating System Interface (POSIX) standards, which means that certain software may be compatible with either one of these systems (HowStuffWorks.com, 2024).</p>
                    </div>
                </div>

                <div 
                    className="venn-point"
                    onClick={(e) => handleClick(e.currentTarget, 'Tools & Environments')}
                >
                    Tools & Environments
                    <div className="point-details">
                        <p>Perhaps in part that both Linux and FreeBSD are Unix-based, they tend to share a number of similar tools and environments. Common shell environments such as sh, bash, zsh, and fish are all present in both systems.</p>
                        <p>Both systems also have similar options for desktop environments. FreeBSD officially supports the tKDE Plasma, GNOME, MATE, Cinnamon, and LXQT desktop environments (Ziaee, 2026), all of which are also supported on various Linux distributions.</p>
                    </div>
                </div>

                <div 
                    className="venn-point"
                    onClick={(e) => handleClick(e.currentTarget, 'Overlapping Domains')}
                >
                    Overlapping Domains
                    <div className="point-details">
                        <p>In enterprise, there is an overlap in where Linux and FreeBSD are often used. FreeBSD is most often used in tasks that involve networking, such as in server environments, content delivery networks, and data centers (FreeBSD.software, 2026) – all of which are common use cases for Linux too. Enterprise Linux, however, does cover a few other domains that FreeBSD does not, such as cloud computing desktop usage (Geeks For Geeks, 2025).</p>
                    </div>
                </div>

                <div 
                    className="venn-point"
                    onClick={(e) => handleClick(e.currentTarget, 'Text File Config')}
                >
                    Text File Config
                    <div className="point-details">
                        <p>Configuration of both Linux and FreeBSD is primarily done through text files. System-wide configurations in both systems can be found in the /etc/ directory. On Linux, user specific configurations can be found in /home/&lt;username&gt;/.config, while configurations of installed applications on FreeBSD can be found in /usr/local/etc (Linux Vox, 2026; Ziaee, 2026).</p>
                        <p>Both even share the same configuration files, such as the /etc/hosts file or the /etc/fstab files. Nevertheless, there are still different files and directories between the two systems, such as the /etc/rc.d directory because rc.d is specific to FreeBSD.</p>
                    </div>
                </div>
            </div>

            <div className="circle freebsd-circle">
                <div 
                    className="venn-point outer-point f-pos-1"
                    onClick={(e) => handleClick(e.currentTarget, 'Operating System')}
                >
                    Operating System
                    <div className="point-details">
                        <p>Unlike Linux, which alone is only a kernel, FreeBSD is a fully-fledged operating system. It uses its own kernel, and also comes with its own applications, features, and utilities that you would need to interact with the system.</p>
                    </div>
                </div>

                <div 
                    className="venn-point outer-point f-pos-2"
                    onClick={(e) => handleClick(e.currentTarget, 'BSD License')}
                >
                    BSD License
                    <div className="point-details">
                        <p>FreeBSD is distributed under the BSD license. This license is rather permissive and allows you to do basically anything you want with its code, only requiring you to include its copyright notice when redistributing the code.</p>
                        <p>Derivative works are not required to be under the same license, which also means that any part of FreeBSD can be used even for proprietary software with no issues with licensing.</p>
                    </div>
                </div>

                <div 
                    className="venn-point outer-point f-pos-3"
                    onClick={(e) => handleClick(e.currentTarget, 'Ports and Packages')}
                >
                    Ports and Packages
                    <div className="point-details">
                        <p>FreeBSD has two main ways of installing applications: ports and packages. Packages are basically pre-compiled binaries ready for installation, and more easily managed than ports, similar to how most package managers work on Linux (Ziaee, 2026).</p>
                        <p>Ports are a large collection of files that include the makefiles and descriptions for compiling a program. This method is more complex and much more time consuming, as it requires you to compile the program from scratch, but it can also allow you to customize the installation of the program to fit your needs (Ziaee, 2026).</p>
                    </div>
                </div>

                <div 
                    className="venn-point outer-point f-pos-4"
                    onClick={(e) => handleClick(e.currentTarget, 'Jails and Limits')}
                >
                    Jails and Limits
                    <div className="point-details">
                        <p>Jails and limits are ways to limit the resources a process can use in FreeBSD. Limits in FreeBSD can be used to set the cpu or memory resource limits for the system or for specific programs, somewhat similar to what cgroups do in Linux (FreeBSD Project, n.d.).</p>
                        <p>Jails actually build off of the Linux chroot by instead virtualizing the access to files, users, and networks of the host system. They produce a partial copy of the system within the jail, creating an environment that is independent of other jails and the main system’s processes (Cruz, 2026).</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VennDiagram;
