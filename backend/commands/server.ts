import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

const port = 8080;

export const server = () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
