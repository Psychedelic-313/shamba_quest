"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sprout, Trophy, Users, Zap, Leaf, Star, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56c6b5be93f6')] bg-cover bg-center opacity-25"></div>
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 text-center flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <Sprout className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold">ShambaQuest</h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
          >
            Master climate-smart agriculture through gamified learning. Earn XP, unlock badges, and become a farming champion!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Button asChild size="lg" className="text-lg rounded-2xl">
              <Link href="/auth/sign-up">Start Your Journey</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg rounded-2xl">
              <Link href="/auth/login">Login</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* WHY SHAMBAQUEST */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Why ShambaQuest?
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Interactive Quizzes", text: "Answer questions about climate-smart farming and get instant AI-powered feedback." },
            { icon: Trophy, title: "Earn Rewards", text: "Collect XP points and unlock achievement badges as you progress." },
            { icon: Users, title: "Compete & Learn", text: "Climb the leaderboard and see how you rank against other young farmers." },
            { icon: Sprout, title: "Real-World Skills", text: "Learn practical sustainable farming techniques for your shamba." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="hover:scale-105 transition-transform shadow-md">
                <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, step: "1. Create an Account", text: "Sign up and set your farming goals." },
              { icon: Star, step: "2. Learn & Earn XP", text: "Play quizzes and climb the ranks." },
              { icon: Leaf, step: "3. Apply Your Skills", text: "Use your new knowledge on your real farm." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{s.step}</h3>
                <p className="text-muted-foreground max-w-xs">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Our Impact
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "500+", label: "Learners" },
            { number: "120+", label: "Badges Earned" },
            { number: "20+", label: "Topics Covered" },
            { number: "95%", label: "User Satisfaction" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-4xl font-bold text-primary">{stat.number}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            What Our Learners Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "/enviroment.png",
                name: "Mary Wanjiku",
                location: "Nakuru County",
                text: "I used to struggle with soil erosion, but now I've learned better crop rotation! ShambaQuest made it easy and fun.",
              },
              {
                img: "/enviroment.png",
                name: "Kevin Ochieng",
                location: "Kisumu",
                text: "Earning XP while learning about farming is genius! I can now apply new techniques on my own shamba.",
              },
              {
                img: "/enviroment.png",
                name: "Amina Noor",
                location: "Garissa",
                text: "ShambaQuest feels like a game but teaches real skills. I've even inspired my friends to join.",
              },
            ].map(({ text, name, location, img }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-all bg-background">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <Image
                      src={img}
                      alt={name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover" />
                    <p className="italic text-muted-foreground">“{text}”</p>
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm text-muted-foreground">{location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-primary text-primary-foreground border-0 shadow-xl">
            <CardContent className="py-12 flex flex-col items-center text-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Become a Climate Champion?</h2>
              <p className="text-lg max-w-2xl opacity-90">
                Join thousands of young Kenyan farmers learning sustainable agriculture practices through fun, interactive quizzes.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg rounded-2xl">
                <Link href="/auth/sign-up">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} ShambaQuest. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
        </div>
      </footer>
    </main>
  )
}
