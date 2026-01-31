/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXXX
 * Example: ORD-20260130-45231
 */
export const generateOrderNumber = (): string => {
    // Get current date
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Generate random 5-digit number
    const random = Math.floor(10000 + Math.random() * 90000);

    // Combine: ORD-YYYYMMDD-XXXXX
    return `ORD-${year}${month}${day}-${random}`;
};