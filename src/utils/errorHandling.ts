import { client } from "./pg";

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

const asyncMiddleware = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(async (error) => {
    console.error("Error stack:", error.stack);
    if (error.file === "postgres.c" || error.severity === "ERROR") {
      await client.query("ROLLBACK");
    }
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message, success: false });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, success: false });
    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({ message: error.message, success: false });
    } else {
      res.status(500).json({
        message: "Something went wrong, please try again",
        error,
        success: false,
      });
    }
  });
};

export { asyncMiddleware, NotFoundError, ValidationError, UnauthorizedError };
