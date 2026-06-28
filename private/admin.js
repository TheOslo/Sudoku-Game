document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;

    try {
        const res = await fetch('/api/puzzles/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(errorText);
            alert(`Error ${res.status}`);
            return;
        }

        const data = await res.json();
        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('adminSection').classList.remove('hidden');
        } else {
            alert('Login Failed');
        }
    } catch (err) {
        console.error(err);
        alert("Error");
    }
});

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('adminToken');
    const puzzleData = document.getElementById('puzzleData').value;

    try {
        const res = await fetch('/api/puzzles', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: puzzleData
        });
        
        const data = await res.json();
        document.getElementById('status').innerText = data.success ? "Success!" : "Failed: " + data.msg;
    } catch (err) {
        document.getElementById('status').innerText = "Failed";
    }
});