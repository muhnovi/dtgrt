"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { RTCard } from "@/components/rt-card";
import { GenderChart } from "@/components/gender-chart";
import { AgeChart } from "@/components/age-chart";
import { Users, Home, MapPin, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getAllPenduduk,
  getStatistikRT,
  getDemografiJenisKelamin,
  getDemografiUmur,
} from "@/lib/firebase-service";
import type { Penduduk } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAllPenduduk();
    setPendudukList(data);
    setLoading(false);
  };

  const statistikRT = getStatistikRT(pendudukList);
  const demografiGender = getDemografiJenisKelamin(pendudukList);
  const demografiUmur = getDemografiUmur(pendudukList);

  const totalPenduduk = pendudukList.length;
  const totalKK = new Set(pendudukList.map((p) => p.noKK)).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="bg-primary text-primary-foreground py-6 px-4 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Penduduk Dukuh Garotan</h1>
            <p className="text-primary-foreground/80 mt-1">
              RW 7 - Kalurahan Bendung, Kapanewon Semin, Kabupaten Gunung Kidul
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/login")}
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login Admin
          </Button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Overall Statistics */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Statistik Keseluruhan RW 7
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Penduduk"
              value={totalPenduduk}
              icon={<Users className="w-8 h-8" />}
              delay={0.1}
            />
            <StatCard
              title="Total Kepala Keluarga"
              value={totalKK}
              icon={<Home className="w-8 h-8" />}
              delay={0.2}
            />
            <StatCard
              title="Jumlah RT"
              value="4 RT"
              icon={<MapPin className="w-8 h-8" />}
              delay={0.3}
            />
          </div>
        </motion.section>

        {/* RT Statistics */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Data Per Rukun Tetangga (RT)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistikRT.map((stat, index) => (
              <RTCard
                key={stat.rt}
                rt={stat.rt}
                jumlahPenduduk={stat.jumlahPenduduk}
                jumlahKK={stat.jumlahKK}
                delay={0.1 * index}
              />
            ))}
          </div>
        </motion.section>

        {/* Demographics */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Demografi Penduduk
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GenderChart
              lakiLaki={demografiGender.lakiLaki}
              perempuan={demografiGender.perempuan}
            />
            <AgeChart data={demografiUmur} />
          </div>
        </motion.section>

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Memuat data...
          </div>
        )}
      </div>
    </div>
  );
}
