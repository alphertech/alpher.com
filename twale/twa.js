// Populate year
        document.getElementById('year').textContent = new Date().getFullYear();
        document.getElementById('currentAge').textContent = new Date().getFullYear() - 2002;

        // Handle contact form: open mail client using mailto: (client-side)
        function handleContact(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                setStatus('Please fill all fields');
                return;
            }

            const subject = encodeURIComponent(`Portfolio message from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailto = `mailto:twalejames83@gmail.com?subject=${subject}&body=${body}`;

            // Try to open mail client
            window.location.href = mailto;
            setStatus('Mail client opened (check your email app).');
        }

        function setStatus(text) {
            const el = document.getElementById('formStatus');
            el.textContent = text;
            setTimeout(() => { if (el.textContent === text) el.textContent = ''; }, 4000);
        }

        function copyEmail() {
            navigator.clipboard && navigator.clipboard.writeText('twalejames83@gmail.com')
                .then(() => setStatus('Email copied to clipboard'))
                .catch(() => setStatus('Copy not supported'));
        }

        // Placeholder for resume download (replace with a real file path to enable download)
        function downloadResume(e) {
            e && e.preventDefault();
            // If you upload resume.pdf next to this file, uncomment the line below:
            // window.location.href = 'resume.pdf';
            alert('Replace the placeholder code to link to your resume PDF (resume.pdf) or a hosted URL.');
        }

        // Progressive enhancement: prefer to attach a server-side endpoint if available
        // Example: if you want server-side emailing, you can POST to an endpoint from here.