// Populate year
        document.getElementById('year').textContent = new Date().getFullYear();

        // Pre-fill contact form when messaging staff
        function prefillContact(name, email) {
            document.getElementById('c_name').value = name || '';
            if (email) document.getElementById('c_email').value = email;
            document.getElementById('c_subject').focus();
            window.location.hash = '#contact';
        }

        // Open mail client flow
        function handleContact(e) {
            e && e.preventDefault();
            const name = document.getElementById('c_name').value.trim();
            const email = document.getElementById('c_email').value.trim();
            const subject = document.getElementById('c_subject').value.trim();
            const message = document.getElementById('c_message').value.trim();

            if (!name || !email || !subject || !message) {
                alert('Please fill all fields.');
                return;
            }

            const mailto = `mailto:twalejames83@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
            window.location.href = mailto;
        }

        // Demo: submit to "server" by saving into internal messages (localStorage)
        function submitToServerDemo() {
            const name = document.getElementById('c_name').value.trim() || 'Anonymous';
            const email = document.getElementById('c_email').value.trim() || '';
            const subject = document.getElementById('c_subject').value.trim() || '';
            const message = document.getElementById('c_message').value.trim() || '';
            const payload = { id: Date.now(), name, email, subject, message, created: new Date().toISOString() };

            const key = 'alpher_internal_messages';
            const current = JSON.parse(localStorage.getItem(key) || '[]');
            current.unshift(payload);
            localStorage.setItem(key, JSON.stringify(current));
            alert('Message saved to internal messages (demo). Staff can load it from the Internal messages panel.');
            clearContactForm();
        }

        function clearContactForm() {
            document.getElementById('c_name').value = '';
            document.getElementById('c_email').value = '';
            document.getElementById('c_subject').value = '';
            document.getElementById('c_message').value = '';
        }

        // Guestboard functions (client-side demo)
        function postGuestMessage() {
            const name = document.getElementById('g_name').value.trim() || 'Guest';
            const text = document.getElementById('g_text').value.trim();
            if (!text) { alert('Write a public note first'); return; }
            const key = 'alpher_guestboard';
            const current = JSON.parse(localStorage.getItem(key) || '[]');
            const item = { id: Date.now(), name, text, created: new Date().toISOString() };
            current.unshift(item);
            localStorage.setItem(key, JSON.stringify(current));
            document.getElementById('g_text').value = '';
            renderGuestboard();
        }


        function renderGuestboard() {
            const key = 'alpher_guestboard';
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            const container = document.getElementById('guestMessages');
            container.innerHTML = '';
            if (list.length === 0) { container.innerHTML = '<div class="muted">No public notes yet — be the first to post.</div>'; return; }
            list.forEach(it => {
                const el = document.createElement('div'); el.className = 'message';
                el.innerHTML = `<div class="msg-meta"><strong>${escapeHtml(it.name)}</strong> • ${new Date(it.created).toLocaleString()}</div><div>${escapeHtml(it.text)}</div>`;
                container.appendChild(el);
            })
        }

        function clearGuestboard() { if (confirm('Clear the guestboard (demo)?')) { localStorage.removeItem('alpher_guestboard'); renderGuestboard(); } }
        function exportGuestboard() { const key = 'alpher_guestboard'; const data = localStorage.getItem(key) || '[]'; const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'alpher_guestboard.json'; a.click(); URL.revokeObjectURL(url); }

        function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[m]; }); }

        // Internal messages (staff view)
        function loadInternalMessages() {
            const key = 'alpher_internal_messages';
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            const container = document.getElementById('internalMessages'); container.innerHTML = '';
            if (list.length === 0) { container.innerHTML = '<div class="muted">No internal messages yet.</div>'; return; }
            list.forEach(it => {
                const el = document.createElement('div'); el.className = 'message';
                el.innerHTML = `<div class="msg-meta"><strong>${escapeHtml(it.name)}</strong> • ${new Date(it.created).toLocaleString()} • <span style="color:var(--muted)">${escapeHtml(it.email)}</span></div><div><strong>${escapeHtml(it.subject)}</strong><div style="margin-top:6px">${escapeHtml(it.message)}</div></div><div style="margin-top:8px"><button class='btn-ghost' onclick='markRead(${it.id})'>Mark read</button> <button class='btn-ghost' onclick='deleteInternal(${it.id})'>Delete</button></div>`;
                container.appendChild(el);
            })
        }

        function clearInternalMessages() { if (confirm('Clear all internal messages (demo)?')) { localStorage.removeItem('alpher_internal_messages'); loadInternalMessages(); } }
        function deleteInternal(id) { const key = 'alpher_internal_messages'; let list = JSON.parse(localStorage.getItem(key) || '[]'); list = list.filter(i => i.id !== id); localStorage.setItem(key, JSON.stringify(list)); loadInternalMessages(); }
        function markRead(id) { alert('Marked as read (demo). In production you would update the message status in the database.'); }

        // Small helper: load guestboard on start
        document.addEventListener('DOMContentLoaded', () => { renderGuestboard(); });