import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Footer = () => {
    return (
        <motion.footer
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500"
        >
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="md:max-w-96"
                >
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={assets.logo}
                        alt="logo"
                        className="h-12 w-auto"
                    />
                    <p className="mt-6 text-sm">
                        Offering a wide selection of rental cars, seamless booking, and dependable service. Whether it's daily rides or long trips, we make car rentals simple, affordable, and convenient.
                    </p>
                </motion.div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91 9380898410</p>
                            <p>shammaschammu000@gmail.com</p>
                        </div>
                    </motion.div>
                </div>
            </div>
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-4 text-center text-xs md:text-sm pb-5"
            >
                Copyright 2026 ©. All Right Reserved.
            </motion.p>
        </motion.footer>
    )
}

export default Footer
