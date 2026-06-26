"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Copy,
  FileSpreadsheet,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";

// Types
interface Client {
  id: number;
  companyName: string;
  companyLogo: string;
  clientName: string;
  clientEmail: string;
}

// Sample client data
const initialClients: Client[] = [
  {
    id: 1,
    companyName: "Samsung Electronics",
    companyLogo: "https://picsum.photos/200/80?random=1",
    clientName: "John Kim",
    clientEmail: "john.kim@samsung.com",
  },
  {
    id: 2,
    companyName: "LG Corporation",
    companyLogo: "https://picsum.photos/200/80?random=2",
    clientName: "Sarah Park",
    clientEmail: "sarah.park@lg.com",
  },
  {
    id: 3,
    companyName: "Sony Group",
    companyLogo: "https://picsum.photos/200/80?random=3",
    clientName: "Michael Tanaka",
    clientEmail: "michael.tanaka@sony.com",
  },
  {
    id: 4,
    companyName: "Panasonic Holdings",
    companyLogo: "https://picsum.photos/200/80?random=4",
    clientName: "Emma Watanabe",
    clientEmail: "emma.watanabe@panasonic.com",
  },
  {
    id: 5,
    companyName: "Toshiba Corporation",
    companyLogo: "https://picsum.photos/200/80?random=5",
    clientName: "David Sato",
    clientEmail: "david.sato@toshiba.com",
  },
  {
    id: 6,
    companyName: "Hitachi Ltd",
    companyLogo: "https://picsum.photos/200/80?random=6",
    clientName: "Lisa Yamamoto",
    clientEmail: "lisa.yamamoto@hitachi.com",
  },
  {
    id: 7,
    companyName: "Sharp Corporation",
    companyLogo: "https://picsum.photos/200/80?random=7",
    clientName: "Robert Suzuki",
    clientEmail: "robert.suzuki@sharp.com",
  },
  {
    id: 8,
    companyName: "Philips International",
    companyLogo: "https://picsum.photos/200/80?random=8",
    clientName: "Maria Garcia",
    clientEmail: "maria.garcia@philips.com",
  },
  {
    id: 9,
    companyName: "Nokia Corporation",
    companyLogo: "https://picsum.photos/200/80?random=9",
    clientName: "Johan Andersson",
    clientEmail: "johan.andersson@nokia.com",
  },
  {
    id: 10,
    companyName: "Ericsson AB",
    companyLogo: "https://picsum.photos/200/80?random=10",
    clientName: "Erik Svensson",
    clientEmail: "erik.svensson@ericsson.com",
  },
  {
    id: 11,
    companyName: "Motorola Solutions",
    companyLogo: "https://picsum.photos/200/80?random=11",
    clientName: "James Wilson",
    clientEmail: "james.wilson@motorola.com",
  },
  {
    id: 12,
    companyName: "Huawei Technologies",
    companyLogo: "https://picsum.photos/200/80?random=12",
    clientName: "Wei Zhang",
    clientEmail: "wei.zhang@huawei.com",
  },
  {
    id: 13,
    companyName: "Xiaomi Corporation",
    companyLogo: "https://picsum.photos/200/80?random=13",
    clientName: "Lei Chen",
    clientEmail: "lei.chen@xiaomi.com",
  },
  {
    id: 14,
    companyName: "Oppo Mobile",
    companyLogo: "https://picsum.photos/200/80?random=14",
    clientName: "Ming Liu",
    clientEmail: "ming.liu@oppo.com",
  },
  {
    id: 15,
    companyName: "Vivo Communication",
    companyLogo: "https://picsum.photos/200/80?random=15",
    clientName: "Hua Wang",
    clientEmail: "hua.wang@vivo.com",
  },
  {
    id: 16,
    companyName: "OnePlus Technology",
    companyLogo: "https://picsum.photos/200/80?random=16",
    clientName: "Carl Pei",
    clientEmail: "carl.pei@oneplus.com",
  },
];

const ITEMS_PER_PAGE: number = 5;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Filter clients based on search
  const filteredClients: Client[] = clients.filter(
    (client) =>
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages: number = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex: number = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex: number = startIndex + ITEMS_PER_PAGE;
  const currentClients: Client[] = filteredClients.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Copy single email
  const copySingleEmail = (email: string): void => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Copy all emails
  const copyAllEmails = (): void => {
    const allEmails: string = clients
      .map((client) => client.clientEmail)
      .join(", ");
    navigator.clipboard.writeText(allEmails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download as Excel (CSV)
  const downloadExcel = (): void => {
    const headers: string[] = [
      "Serial",
      "Company Name",
      "Client Name",
      "Client Email",
    ];
    const rows: string[][] = clients.map((client, index) => [
      String(index + 1),
      client.companyName,
      client.clientName,
      client.clientEmail,
    ]);

    let csvContent: string = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob: Blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link: HTMLAnchorElement = document.createElement("a");
    const url: string = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "clients_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination controls
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="min-h-screen py-4 md:py-6 bg-white">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6"
        >
          <Link
            href="/clients/add"
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-primary hover:bg-primary-hover text-white text-xs md:text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Add Client</span>
          </Link>

          <button
            onClick={copyAllEmails}
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs md:text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
          >
            <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Copy All Emails</span>
            {copiedAll && (
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
            )}
          </button>

          <button
            onClick={downloadExcel}
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs md:text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Sheet List</span>
          </button>

          {/* Search Bar */}
          <div className="ml-auto w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full sm:w-44 md:w-52 pl-8 pr-3 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-150">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Serial
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client Email
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentClients.length > 0 ? (
                  currentClients.map((client: Client, index: number) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 md:px-5 py-3 md:py-4 text-sm text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-7 h-7 md:w-9 md:h-9 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                            <Image
                              src={client.companyLogo}
                              alt={client.companyName}
                              width={36}
                              height={36}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <span className="text-sm md:text-base text-gray-800 font-medium">
                            {client.companyName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4 text-sm md:text-base text-gray-700">
                        {client.clientName}
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <span className="text-sm md:text-base text-gray-700">
                            {client.clientEmail}
                          </span>
                          <button
                            onClick={() => copySingleEmail(client.clientEmail)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy email"
                          >
                            {copiedEmail === client.clientEmail ? (
                              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <Link
                          href={`/clients/edit/${client.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-hover text-sm font-medium transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 md:px-5 py-8 text-center text-gray-500"
                    >
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="text-sm text-gray-500 order-2 sm:order-1">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredClients.length)} of{" "}
              {filteredClients.length} clients
            </div>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: totalPages }, (_, i: number) => i + 1).map(
                (page: number) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-8 h-8 md:min-w-9 md:h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex justify-end text-xs text-gray-400"
        >
          <span>Total Clients: {clients.length}</span>
        </motion.div>
      </div>
    </section>
  );
}
