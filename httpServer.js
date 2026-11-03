import { createServer } from 'http';
import { readFile } from 'fs';
import { join } from 'path';

const PORT = 3000;

let tasks = [
  { id: 1, taskName: 'Design Database Schema', assignedTo: 'Alice', status: 'In Progress' },
  { id: 2, taskName: 'Develop Auth API', assignedTo: 'Bob', status: 'Pending' }
];

const server = createServer((req, res) => {
  const { method, url } = req;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to the Employee Task Management System</h1>');
  }

  else if (url === '/tasks' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
  }

  else if (url === '/add-task' && method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const newTask = JSON.parse(body);

        const { id, taskName, assignedTo, status } = newTask;
        if (!id || !taskName || !assignedTo || !status) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              error: 'Missing required fields. Required: id, taskName, assignedTo, status.'
            })
          );
        }

        tasks.push({ id, taskName, assignedTo, status });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: 'Task added successfully',
            task: newTask
          })
        );
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
  }

  else if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(
      'Employee Task Management Application: A simple Node.js native HTTP server to track and manage employee tasks.'
    );
  }

  else if (url === '/home' && method === 'GET') {
    const filePath = join(__dirname, 'public', 'index.html');

    readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: public/index.html file missing');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
        }
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '404 Route Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});