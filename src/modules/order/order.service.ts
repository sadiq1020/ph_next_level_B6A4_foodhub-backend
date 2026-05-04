import { prisma } from "../../lib/prisma";
import { ICreateOrder } from "./order.interface";
import { generateOrderNumber } from "./order.utils";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Create enrollment (order)
const createOrder = async (data: ICreateOrder) => {
  // 1. Fetch course prices from DB — never trust frontend prices
  const courseIds = data.items.map((item) => item.courseId);
  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
  });

  // 2. Calculate subtotal
  let subtotal = 0;
  const enrollmentItemsData = data.items.map((item) => {
    const course = courses.find((c) => c.id === item.courseId);
    if (!course) throw new Error(`Course ${item.courseId} not found`);

    const itemTotal = (course.price as any) * item.quantity;
    subtotal += itemTotal;

    return {
      courseId: item.courseId,
      quantity: item.quantity,
      price: course.price, // lock in price at enrollment time
    };
  });

  // 3. No delivery fee — digital product
  const total = subtotal;
  const orderNumber = generateOrderNumber();
  const accessUntil = new Date(Date.now() + ONE_YEAR_MS);

  // 4. Create Order + EnrollmentItems in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        notes: data.notes ?? null,
        subtotal,
        total,
        accessUntil,
        status: "PENDING",
      },
    });

    await tx.enrollmentItem.createMany({
      data: enrollmentItemsData.map((item) => ({
        orderId: newOrder.id,
        courseId: item.courseId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return tx.order.findUnique({
      where: { id: newOrder.id },
      include: {
        items: {
          include: { course: true },
        },
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  });

  return order;
};

// Update enrollment status (INSTRUCTOR only)
const updateOrderStatus = async (
  orderId: string,
  status: string,
  userId: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          course: {
            include: {
              instructor: {
                select: { id: true, userId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) throw new Error("Enrollment not found");

  const hasInstructorCourses = order.items.some(
    (item) => item.course.instructor.userId === userId,
  );

  if (!hasInstructorCourses) {
    throw new Error("You can only update enrollments for your own courses");
  }

  const allowedStatuses = ["ACTIVE", "COMPLETED", "EXPIRED"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status. Allowed: ACTIVE, COMPLETED, EXPIRED");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
    include: {
      items: {
        include: { course: true },
      },
      customer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedOrder;
};

// Cancel enrollment (CUSTOMER only, while PENDING)
const cancelOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, customerId: true, status: true },
  });

  if (!order) throw new Error("Enrollment not found");

  if (order.customerId !== userId) {
    throw new Error("You can only cancel your own enrollments");
  }

  if (order.status !== "PENDING") {
    throw new Error("Only PENDING enrollments can be cancelled");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
    include: {
      items: {
        include: { course: true },
      },
      customer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedOrder;
};

// Get my enrollments (CUSTOMER only)
const getMyOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      items: {
        include: {
          course: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              duration: true,
              difficulty: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

// Get all enrollments (ADMIN only)
const getAllOrdersForAdmin = async () => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          course: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

// Get enrollment by ID (CUSTOMER / INSTRUCTOR)
const getOrderById = async (
  orderId: string,
  userId: string,
  userRole: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          course: {
            include: {
              instructor: {
                select: { id: true, businessName: true, userId: true },
              },
            },
          },
        },
      },
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!order) throw new Error("Enrollment not found");

  if (userRole === "CUSTOMER") {
    if (order.customerId !== userId) {
      throw new Error("You can only view your own enrollments");
    }
  } else if (userRole === "INSTRUCTOR") {
    const hasInstructorCourses = order.items.some(
      (item) => item.course.instructor.userId === userId,
    );
    if (!hasInstructorCourses) {
      throw new Error("You can only view enrollments for your own courses");
    }
  }

  return order;
};

export const orderService = {
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  getOrderById,
};
