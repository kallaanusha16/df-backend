import express, { Request, Response } from 'express';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Types
interface Employee {
  id: string;
  name: string;
  department: string;
  salary: string;
}

// Greeting endpoint
app.get('/greeting', (req: Request, res: Response) => {
  res.json({ message: 'Hello, welcome to the API!' });
});

// Get all employees
app.get('/employees', (req: Request, res: Response) => {
  const employees: Employee[] = [];
  
  fs.createReadStream(path.join(__dirname, 'data', 'employees.csv'))
    .pipe(parse({ columns: true }))
    .on('data', (data: Employee) => employees.push(data))
    .on('end', () => {
      res.json(employees);
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error reading employees data' });
    });
});

// Get employees by department
app.get('/employees/department/:department', (req: Request, res: Response) => {
  const department = req.params.department;
  const employees: Employee[] = [];
  
  fs.createReadStream(path.join(__dirname, 'data', 'employees.csv'))
    .pipe(parse({ columns: true }))
    .on('data', (data: Employee) => {
      if (data.department.toLowerCase() === department.toLowerCase()) {
        employees.push(data);
      }
    })
    .on('end', () => {
      res.json(employees);
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error reading employees data' });
    });
});

// Get all departments
app.get('/departments', (req: Request, res: Response) => {
  const departments = new Set<string>();
  
  fs.createReadStream(path.join(__dirname, 'data', 'employees.csv'))
    .pipe(parse({ columns: true }))
    .on('data', (data: Employee) => {
      departments.add(data.department);
    })
    .on('end', () => {
      res.json(Array.from(departments));
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error reading departments data' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 