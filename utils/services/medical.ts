import db from "@/lib/db";

export async function getAllMedicalRecords({
  page = 1,
  search = "",
}: {
  page?: number;
  search?: string;
}) {
  try {
    const limit = 10;
    const offset = (page - 1) * limit;

    // Basic query without complex search for now
    const whereClause = search
      ? {
          OR: [
            { treatment_plan: { contains: search } },
            { notes: { contains: search } },
          ],
        }
      : {};

    const [data, totalRecords] = await Promise.all([
      db.medicalRecords.findMany({
        where: whereClause,
        include: {
          patient: true,
          diagnosis: true,
          vital_signs: true,
          appointment: {
            include: {
              doctor: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        take: limit,
        skip: offset,
      }),
      db.medicalRecords.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      success: true,
      data,
      totalPages,
      totalRecords,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return {
      success: false,
      data: [],
      totalPages: 0,
      totalRecords: 0,
      currentPage: page,
    };
  }
}

export async function getMedicalRecordById(id: number) {
  try {
    const data = await db.medicalRecords.findUnique({
      where: { id },
      include: {
        patient: true,
        diagnosis: true,
        vital_signs: true,
        appointment: {
          include: {
            doctor: true,
          },
        },
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return {
      success: false,
      data: null,
    };
  }
}
