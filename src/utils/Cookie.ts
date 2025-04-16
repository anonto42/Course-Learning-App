import express from "express";

export const CookieOptions:express.CookieOptions = {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true
}