import { prisma } from "../lib/prisma";
import { ROLES } from "../shared";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin Sadiq2",
      email: "admin@sadiq2.com",
      password: "admin1234",
      role: ROLES.ADMIN,
    };

    // checking user exist in the DB or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Sign up admin through API
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      },
    );

    console.log(signUpAdmin);
    // const responseData = await signUpAdmin.json();
    // console.log("Response:", responseData);

    if (signUpAdmin.ok) {
      // Update to verify email after signup
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
}

seedAdmin();
