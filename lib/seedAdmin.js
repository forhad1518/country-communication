import User  from "@/models/auth/users";
import { hashPassword } from "@/lib/passwordHash";

export const seedAdmin = async () => {
    if (process.env.IS_ADMIN_CREATED === "true") {
        try {
            const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
            if (existingAdmin) {
                console.log("Admin user already exists.");
                return;
            }

            const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
            const adminUser = new User({
                name: "Admin",
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: "admin",
            });

            await adminUser.save();
            console.log("Admin user created successfully.");
        } catch (error) {
            console.error("Error creating admin user:", error);
        }
    } else {
        console.log("Admin user creation is disabled.");
    }
};