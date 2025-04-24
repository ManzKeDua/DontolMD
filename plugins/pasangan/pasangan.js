const Uploader = require("../../lib/uploader.js")
const fs = require('fs')

const CONFIG_FILE = './json/couple_config.json'
const COUPLE_FILE = './json/pasangan.json'
const ARCHIVED_COUPLES_FILE = './json/archived_couples.json'

function readConfig() {
    try {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        const defaultConfig = {
            lifecycleConfig: {
                ageProgression: {
                    bayi: { min: 0, max: 2 },
                    anak: { min: 3, max: 12 },
                    remaja: { min: 13, max: 17 }, dewasa: { min: 18, max: 40 },
                    paruhBaya: { min: 41, max: 60 },
                    lansia: { min: 61, max: 80 }
                },
                fertilityAge: { min: 18, max: 45 },
                mortalityRisks: { lansia: 0.05, paruhBaya: 0.02, dewasa: 0.01 }
            },
            careerConfig: {
                baseIncomes: {
                    'Pelajar': { min: 0, max: 500 },
                    'Karyawan Biasa': { min: 2000, max: 5000 },
                    'Manajer': { min: 5000, max: 10000 },
                    'Direktur': { min: 10000, max: 20000 }
                },
                careerProgression: {
                    'Pelajar': ['SMA', 'Kuliah'],
                    'Karyawan Biasa': ['Junior', 'Senior', 'Supervisor'],
                    'Manajer': ['Manajer Junior', 'Manajer Senior', 'Kepala Divisi'],
                    'Direktur': ['Direktur Muda', 'Direktur Senior', 'CEO']
                }
            },
            marriageRequirements: {
                minAge: 18,
                minRelationshipDuration: 365,
                minCompatibilityScore: 70
            },
            maxChildren: 3,
            savingsConfig: {
                interestRate: 0.005,
                withdrawalFee: 0.02
            },
            activitiesConfig: {
                maxActivitiesStored: 10,
                specialActivities: [
                    'Ajak dia jalan-jalan di taman', 
                    'Liburan bersama', 
                    'Makan malam spesial', 
                    'Nonton film bersama'
                ]
            }
        }

        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8')
        return defaultConfig
    }
}

class CoupleManager {
    constructor() {
        this.config = readConfig()
        this.couples = this.loadCouples()
        this.archivedCouples = this.loadArchivedCouples()
    }

    loadCouples() {
        try {
            return JSON.parse(fs.readFileSync(COUPLE_FILE, 'utf-8') || '[]')
        } catch (err) {
            return []
        }
    }

    loadArchivedCouples() {
        try {
            return JSON.parse(fs.readFileSync(ARCHIVED_COUPLES_FILE, 'utf-8') || '[]')
        } catch (err) {
            return []
        }
    }

    saveCouples() {
        fs.writeFileSync(COUPLE_FILE, JSON.stringify(this.couples, null, 2), 'utf-8')
    }

    saveArchivedCouples() {
        fs.writeFileSync(ARCHIVED_COUPLES_FILE, JSON.stringify(this.archivedCouples, null, 2), 'utf-8')
    }

    periodicLifecycleUpdate() {
        this.couples.forEach(couple => {
            this.updateAge(couple)
            this.checkMortality(couple)
            this.updateCareer(couple)
            this.updateSavings(couple)
            this.generateRandomEvents(couple)
            this.generateRelationshipChallenges(couple)
            this.simulateRelationshipChallenges(couple)
        })
        this.saveCouples()
    }

    updateAge(couple) {
        couple.umur = (couple.umur || 0) + 1
        couple.anak.forEach(anak => {
            anak.umur += 1
            anak.kategoriUmur = this.determineAgeCategory(anak.umur)
        })
    }

    determineAgeCategory(umur) {
        const { ageProgression } = this.config.lifecycleConfig
        for (const [category, {
                min,
                max
            }] of Object.entries(ageProgression)) {
            if (umur >= min && umur <= max) return category
        }
        return 'lansia'
    }

    checkMortality(couple) {
        const {
            mortalityRisks
        } = this.config.lifecycleConfig
        const ageCategory = this.determineAgeCategory(couple.umur)
        const deathChance = mortalityRisks[ageCategory] || 0

        if (Math.random() < deathChance) {
            this.archiveCouple(couple, 'Meninggal karena usia')
        }
    }

    archiveCouple(couple, reason) {
        const archivedCouple = {
            ...couple,
            archiveDate: new Date().toISOString(),
            archiveReason: reason
        }
        this.archivedCouples.push(archivedCouple)
        this.couples = this.couples.filter(c => c.pemilik !== couple.pemilik)
        this.saveCouples()
        this.saveArchivedCouples()
    }

    updateCareer(couple) {
        const { careerProgression, baseIncomes } = this.config.careerConfig

        if (Math.random() < 0.1) {
            const currentCareer = couple.pekerjaan || 'Pelajar'
            const progressionPath = careerProgression[currentCareer] || []
            const currentIndex = progressionPath.indexOf(couple.jabatan || progressionPath[0])

            if (currentIndex < progressionPath.length - 1) {
                couple.jabatan = progressionPath[currentIndex + 1]

                const incomeRange = baseIncomes[couple.pekerjaan] || baseIncomes['Karyawan Biasa']
                couple.gaji = Math.floor(Math.random() * (incomeRange.max - incomeRange.min) + incomeRange.min)
            }
        }
    }

    updateSavings(couple) {
        const { interestRate } = this.config.savingsConfig
        couple.tabungan = (couple.tabungan || 0) * (1 + interestRate)
    }

    generateRandomEvents(couple) {
        const events = [
            'Konflik Kecil',
            'Liburan Romantis',
            'Krisis Keuangan',
            'Keberhasilan Karier',
            'Masalah Kesehatan'
        ]

        if (Math.random() < 0.2) {
            const event = events[Math.floor(Math.random() * events.length)]
            couple.events = couple.events || []
            couple.events.push({
                event: event,
                date: new Date().toISOString(),
                impact: this.calculateEventImpact(event, couple)
            })
        }
    }

    calculateEventImpact(event, couple) {
        switch (event) {
            case 'Konflik Kecil':
                couple.trustLevel -= 5
                break
            case 'Liburan Romantis':
                couple.romantikLevel += 10
                break
            case 'Krisis Keuangan':
                couple.tabungan *= 0.9
                break
            case 'Keberhasilan Karier':
                couple.romantikLevel += 5
                break
            case 'Masalah Kesehatan':
                couple.trustLevel += 5
                break
        }
    }

    assessRelationshipHealth(couple) {
        const factors = [
            { 
                name: 'kommunikasiLevel', 
                impact: couple.komunikasiLevel < 50 ? -10 : 
                        couple.komunikasiLevel > 75 ? 5 : 0 
            },
            { 
                name: 'romantikLevel', 
                impact: couple.romantikLevel < 30 ? -15 : 
                        couple.romantikLevel > 70 ? 5 : 0 
            },
            { 
                name: 'trustLevel', 
                impact: couple.trustLevel < 40 ? -20 : 
                        couple.trustLevel > 80 ? 5 : 0 
            },
            { 
                name: 'konflikHistory', 
                impact: (couple.events || [])
                    .filter(e => e.event === 'Konflik Kecil')
                    .length * -2 
            }
        ]

        const healthScore = factors.reduce((total, factor) => total + factor.impact, 100)
        const breakupChance = Math.max(0, (100 - healthScore) / 100)
        const infidelityRisk = this.calculateInfidelityRisk(couple)

        return { 
            healthScore, 
            breakupChance, 
            infidelityRisk 
        }
    }

    calculateInfidelityRisk(couple) {
        const riskFactors = [
            couple.romantikLevel < 30 ? 0.3 : 0,
            couple.trustLevel < 50 ? 0.2 : 0,
            couple.aktivitas.length === 0 ? 0.1 : 0,
            Math.random() * 0.1
        ]

        return Math.min(riskFactors.reduce((a, b) => a + b, 0), 1)
    }

    simulateRelationshipChallenges(couple) {
        const { breakupChance, infidelityRisk } = this.assessRelationshipHealth(couple)

        if (Math.random() < breakupChance) {
            const breakupReasons = [
                'Kurangnya Komunikasi',
                'Hilangnya Kepercayaan',
                'Perbedaan Minat',
                'Tekanan Eksternal',
                'Perselingkuhan'
            ]

            const reason = breakupReasons[Math.floor(Math.random() * breakupReasons.length)]
            
            this.archiveCouple(couple, `Putus: ${reason}`)
            
            return {
                status: 'Breakup',
                reason: reason
            }
        }

        if (Math.random() < infidelityRisk) {
            couple.events.push({
                event: 'Perselingkuhan',
                date: new Date().toISOString(),
                impact: -30
            })

            couple.trustLevel = Math.max(0, couple.trustLevel - 30)
            couple.romantikLevel = Math.max(0, couple.romantikLevel - 25)
        }

        return { status: 'Ongoing' }
    }

    generateRelationshipChallenges(couple) {
        const challengeTypes = [
            {
                name: 'Krisis Keuangan',
                impact: (couple) => {
                    couple.tabungan *= 0.8
                    couple.trustLevel -= 10
                }
            },
            {
                name: 'Masalah Karier',
                impact: (couple) => {
                    couple.gaji *= 0.9
                    couple.romantikLevel -= 5
                }
            },
            {
                name: 'Konflik Keluarga',
                impact: (couple) => {
                    couple.trustLevel -= 15
                    couple.komunikasiLevel -= 10
                }
            },
            {
                name: 'Perbedaan Visi Masa Depan',
                impact: (couple) => {
                    couple.romantikLevel -= 20
                    couple.status = 'Renggang'
                }
            }
        ]

        if (Math.random() < 0.2) {
            const challenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]
            
            challenge.impact(couple)
            
            couple.events.push({
                event: challenge.name,
                date: new Date().toISOString(),
                impact: -10
            })
        }
    }

    createCouple(owner, partner) {
        const newCouple = {
            pemilik: owner,
            pasangan: partner,
            umur: 18,
            status: 'Pacaran',
            tanggalJadian: new Date().toISOString(),
            pekerjaan: 'Pelajar',
            jabatan: 'Pelajar',
            gaji: 0,
            image: null,
            tabungan: 0,
            komunikasiLevel: 0,
            romantikLevel: 50,
            trustLevel: 50,
            aktivitas: [],
            anak: [],
            events: []
        }
        this.couples.push(newCouple)
        this.saveCouples()
        return newCouple
    }
}

const coupleSystem = async (m, { conn, args, usedPrefix }) => {
    const coupleManager = new CoupleManager()
    const config = coupleManager.config

    const userName = db.data.users[m.sender].nama

    let userCouple = coupleManager.couples.find((p) => p.pemilik === userName)

    const subCommand = args[0]?.toLowerCase()

    if (Math.random() < 0.1) {
        coupleManager.periodicLifecycleUpdate()
    }
    
    if (userCouple) {
        if (userCouple.romantikLevel > 100) {
            userCouple.romantikLevel = 100
        }
        if (userCouple.trustLevel > 100) {
            userCouple.trustLevel = 100
        }
        if (userCouple.komunikasiLevel > 10000) {
            userCouple.komunikasiLevel = 10000
        }
    }

    switch (subCommand) {
        case 'cari':
            if (userCouple) return conn.sendMessage(m.chat, { text: `Kamu sudah memiliki pasangan bernama *${userCouple.pasangan}*. Putuskan hubungan dulu dengan perintah *${usedPrefix}pas putus* jika ingin mencari pasangan baru.` })

            const targetName = args.slice(1).join(' ')
            if (!targetName) return conn.sendMessage(m.chat, { text: `Masukkan nama calon pasangan. Contoh: *${usedPrefix}pas cari Clara*` })
            if (!thisUser[m.sender].gender) return conn.sendMessage(m.chat, { text: 'Kamu harus membuat karakter terlebih dahulu.' })
 
            const targetCouple = coupleManager.couples.find(p =>
                p.pemilik.toLowerCase() === targetName.toLowerCase() ||
                p.pasangan.toLowerCase() === targetName.toLowerCase()
            )

            if (targetCouple) return conn.sendMessage(m.chat, { text: `*${targetName}* sudah memiliki pasangan.` })

            const newCouple = coupleManager.createCouple(userName, targetName)

            return m.reply(`Selamat! Kamu sekarang berpacaran dengan *${targetName}*! 💑\n` +
                `Umur: ${newCouple.umur} tahun\n` +
                `Pekerjaan: ${newCouple.pekerjaan} (${newCouple.jabatan})`)
        case 'putus':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            coupleManager.couples = coupleManager.couples.filter(p => p.pemilik !== userName)
            coupleManager.saveCouples()

            return conn.sendMessage(m.chat, { text: `Kamu telah berpisah dengan *${userCouple.pasangan}* 💔` })
        case 'info':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            const duration = calculateRelationshipDuration(userCouple.tanggalJadian)
            let infoText = `*Detail Hubungan* 💑\n\n`
            infoText += `Nama: *${userName}*\n`
            infoText += `Pasangan: *${userCouple.pasangan}*\n`
            infoText += `Status: *${userCouple.status || 'Tidak Diketahui'}*\n`
            infoText += `Tanggal Jadian: *${formatDate(userCouple.tanggalJadian)}*\n`
            infoText += `Lama Hubungan: *${duration}*\n`

            if (userCouple.anak && Array.isArray(userCouple.anak) && userCouple.anak.length > 0) {
                infoText += `\n*Anak-anak:*\n`
                userCouple.anak.forEach((child, i) => {
                    infoText += `${i+1}. ${child.nama || 'Nama Tidak Diketahui'} (${child.umur || 0} tahun)\n`
                })
            }

            if (userCouple.aktivitas && Array.isArray(userCouple.aktivitas) && userCouple.aktivitas.length > 0) {
                infoText += `\n*Aktivitas Terakhir:*\n`
                const recentActivities = userCouple.aktivitas.slice(-3)
                recentActivities.forEach((activity, i) => {
                    infoText += `${i+1}. ${activity.aktivitas || 'Aktivitas Tidak Diketahui'} (${activity.tanggal ? formatDate(activity.tanggal) : 'Tanggal Tidak Diketahui'})\n`
                })
            }

            if (userCouple.image) {
                await conn.sendMessage(m.chat, { image: { url: userCouple.image }, caption: infoText })
            } else {
                await conn.sendMessage(m.chat, { text: infoText })
            }
            return
        case 'aktivitas':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            const activity = args.slice(1).join(' ')
            if (!activity) {
                const specialActivities = config.activitiesConfig.specialActivities
                let suggestionText = '*Aktivitas Spesial yang Disarankan:*\n'
                specialActivities.forEach((act, i) => {
                    suggestionText += `${i+1}. ${act}\n`
                })
                return conn.sendMessage(m.chat, { text: suggestionText.trim() })
            }

            if (userCouple.aktivitas.length >= config.activitiesConfig.maxActivitiesStored) {
                userCouple.aktivitas.shift()
            }

            userCouple.aktivitas.push({
                aktivitas: activity,
                tanggal: new Date().toISOString(),
                romantikScore: calculateRomantikScore(activity)
            })

            userCouple.romantikLevel += calculateRomantikScore(activity) / 10
            userCouple.komunikasiLevel += 1

            coupleManager.saveCouples()

            return conn.sendMessage(m.chat, { text: `Kamu dan *${userCouple.pasangan}* telah melakukan aktivitas: *${activity}* 😊\nRomantic Level Meningkat!` })
        case 'anak':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            if (userCouple.status !== 'Menikah') return conn.sendMessage(m.chat, { text: 'Kamu harus menikah terlebih dahulu untuk memiliki anak.' })

            if (userCouple.anak.length >= config.maxChildren) return conn.sendMessage(m.chat, { text: `Kamu sudah memiliki maksimal ${config.maxChildren} anak.` })

            const childAction = args[1]?.toLowerCase()

            if (childAction === 'tambah') {
                const childName = args.slice(2).join(' ')
                if (!childName) return conn.sendMessage(m.chat, { text: `Masukkan nama anak. Contoh: *${usedPrefix}pas anak tambah Budi*` })

                userCouple.anak.push({
                    nama: childName,
                    tanggalLahir: new Date().toISOString(),
                    umur: 0,
                    kategoriUmur: 'bayi',
                    traits: generateChildTraits()
                })

                coupleManager.saveCouples()

                return conn.sendMessage(m.chat, { text: `Selamat! Kamu dan *${userCouple.pasangan}* telah memiliki anak bernama *${childName}* 👶` })
            } else if (childAction === 'list') {
                if (userCouple.anak.length === 0) {
                    return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki anak.' })
                }

                let childrenText = '*Daftar Anak:*\n\n'
                userCouple.anak.forEach((child, i) => {
                    childrenText += `${i+1}. ${child.nama} (${child.umur} tahun)\n`
                    childrenText += `   Lahir: ${formatDate(child.tanggalLahir)}\n`
                })

                return conn.sendMessage(m.chat, { text: childrenText.trim() })
            } else {
                return conn.sendMessage(m.chat, { text: `Perintah tidak valid. Gunakan *${usedPrefix}pas anak tambah [nama]* atau *${usedPrefix}pas anak list*` })
            }
        case 'nikah':
        case 'menikah':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            const { minAge, minRelationshipDuration, minCompatibilityScore } = config.marriageRequirements

            const relationshipDuration = new Date() - new Date(userCouple.tanggalJadian)
            const relationshipDurationDays = relationshipDuration / (1000 * 60 * 60 * 24)

            if (userCouple.umur < minAge) return conn.sendMessage(m.chat, { text: `Umur minimal untuk menikah adalah ${minAge} tahun. Saat ini umurmu ${userCouple.umur} tahun.` })

            if (relationshipDurationDays < minRelationshipDuration) return conn.sendMessage(m.chat, { text: `Hubungan minimal harus ${minRelationshipDuration} hari sebelum menikah. Saat ini baru ${Math.floor(relationshipDurationDays)} hari.` })

            const compatibilityScore = Math.floor(Math.random() * 100)
            if (compatibilityScore < minCompatibilityScore) return conn.sendMessage(m.chat, { text: `Tingkat kecocokan kamu masih rendah (${compatibilityScore}%). Minimal ${minCompatibilityScore} untuk menikah.` })

            userCouple.status = 'Menikah'
            userCouple.tanggalNikah = new Date().toISOString()

            coupleManager.saveCouples()

            return m.reply(`Selamat! Kamu dan *${userCouple.pasangan}* telah resmi menikah! 💍👰🤵\n` +
                `Umur: ${userCouple.umur} tahun\n` +
                `Pekerjaan: ${userCouple.pekerjaan} (${userCouple.jabatan})`)
        case 'list':
            if (coupleManager.couples.length === 0) return conn.sendMessage(m.chat, { text: 'Belum ada pasangan yang terdaftar.' })

            let coupleList = '*Daftar Pasangan:*\n\n'
            coupleManager.couples.forEach((couple, i) => {
                coupleList += `${i + 1}. *${couple.pemilik}* & *${couple.pasangan}*\n`
                coupleList += `   Status: ${couple.status}\n`
                coupleList += `   Lama Hubungan: ${calculateRelationshipDuration(couple.tanggalJadian)}\n\n`
            })

            return conn.sendMessage(m.chat, { text: coupleList.trim() })
        case 'lihat':
            const targetCoupleName = args.slice(1).join(' ')
            if (!targetCoupleName) return conn.sendMessage(m.chat, { text: `Masukkan nama orang yang ingin dilihat. Contoh: *${usedPrefix}pas lihat John*` })
            const targetCoupleInfo = coupleManager.couples.find(
                p => p.pemilik.toLowerCase() === targetCoupleName.toLowerCase() ||
                p.pasangan.toLowerCase() === targetCoupleName.toLowerCase()
            )

            if (!targetCoupleInfo) return conn.sendMessage(m.chat, { text: `*${targetCoupleName}* tidak memiliki pasangan atau tidak ditemukan.` })

            const targetDuration = calculateRelationshipDuration(targetCoupleInfo.tanggalJadian)
            let targetInfoText = `*Detail Hubungan* 💑\n\n`
            targetInfoText += `Nama: *${targetCoupleInfo.pemilik}*\n`
            targetInfoText += `Pasangan: *${targetCoupleInfo.pasangan}*\n`
            targetInfoText += `Status: *${targetCoupleInfo.status}*\n`
            targetInfoText += `Tanggal Jadian: *${formatDate(targetCoupleInfo.tanggalJadian)}*\n`
            targetInfoText += `Lama Hubungan: *${targetDuration}*\n`

            if (targetCoupleInfo.anak && targetCoupleInfo.anak.length > 0) {
                targetInfoText += `\n*Anak-anak:*\n`
                targetCoupleInfo.anak.forEach((child, i) => {
                    targetInfoText += `${i + 1}. ${child.nama} (${child.umur} tahun)\n`
                })
            }

            if (targetCoupleInfo.image) {
                await conn.sendMessage(m.chat, { image: { url: targetCoupleInfo.image }, caption: targetInfoText })
            } else {
                await conn.sendMessage(m.chat, { text: targetInfoText })
            }
            return
        case 'setimage':
        case 'setimg':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.sendMessage(m.chat, { text: `Kirim atau balas gambar dengan perintah *${usedPrefix}pas setimage*` })

            let media = await q.download()
            let mimetype = /image\/(png|jpe?g)/.test(mime)

            if (!mimetype) return conn.sendMessage(m.chat, { text: `Format ${mime} tidak didukung. Gunakan format gambar (jpg/png).` })

            try {
                let link = await Uploader.catbox(media)
                userCouple.image = link

                coupleManager.saveCouples()

                return conn.sendMessage(m.chat, { text: `Berhasil mengatur gambar untuk hubungan kamu dengan *${userCouple.pasangan}*!` })
            } catch (error) {
                console.log(error)
                return conn.sendMessage(m.chat, { text: 'Gagal mengunggah gambar. Silakan coba lagi nanti.' })
            }
        case 'romantic':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            const romantikAction = args[1]?.toLowerCase()

            switch (romantikAction) {
                case 'hadiah':
                    const giftName = args.slice(2).join(' ')
                    if (!giftName) return conn.sendMessage(m.chat, { text: 'Masukkan nama hadiah yang ingin diberikan.' })

                    userCouple.romantikLevel += calculateGiftImpact(giftName)
                    userCouple.aktivitas.push({
                        aktivitas: `Memberikan hadiah: ${giftName}`,
                        tanggal: new Date().toISOString()
                    })

                    coupleManager.saveCouples()

                    return conn.sendMessage(m.chat, { text: `Kamu memberikan hadiah *${giftName}* kepada *${userCouple.pasangan}*. Romantic level meningkat! 💕` })
                default:
                    return m.reply(`Status Hubungan dengan *${userCouple.pasangan}*:\n` +
                        `Romantis: ${userCouple.romantikLevel}/100\n` +
                        `Komunikasi: ${userCouple.komunikasiLevel}/10.000\n` +
                        `Kepercayaan: ${userCouple.trustLevel}/100`)
            }
        case 'karier':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            const careerAction = args[1]?.toLowerCase()

            switch (careerAction) {
                case 'info':
                    return m.reply(
                        `*Informasi Karier Pasangan*\n\n` +
                        `Pekerjaan: *${userCouple.pekerjaan}*\n` +
                        `Jabatan: *${userCouple.jabatan}*\n` +
                        `Gaji: *Rp ${userCouple.gaji.toLocaleString()}*`)

                case 'jatah':
                    const salaryPercentage = Math.random() * 0.3 + 0.3
                    const salaryCollected = Math.floor(userCouple.gaji * salaryPercentage)

                    db.data.users[m.sender].money = (db.data.users[m.sender].money || 0) + salaryCollected
                    userCouple.tabungan += (userCouple.gaji - salaryCollected)

                    coupleManager.saveCouples()

                    return m.reply(
                        `Kamu mendapat jatah sebesar *$${salaryCollected.toLocaleString()}*\n` +
                        `Sisanya *$${(userCouple.gaji - salaryCollected).toLocaleString()}* masuk ke tabungan bersama.`
                    )

                default:
                    return m.reply(
                        `*Pilihan Karier*\n\n` +
                        `*${usedPrefix}pas karier info* - Lihat informasi karier\n` +
                        `*${usedPrefix}pas karier jatah* - Minta jatah dari gaji pasanganmu`)
            }
        case 'tabungan':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            const savingsAction = args[1]?.toLowerCase()
            const amount = parseInt(args[2])

            switch (savingsAction) {
                case 'info':
                    return m.reply(
                        `*Informasi Tabungan Bersama*\n\n` +
                        `Saldo: *$${userCouple.tabungan.toLocaleString()}/$100.000*`)

                case 'deposit':
                    if (!amount || amount <= 0) 'Masukkan jumlah deposit yang valid.'

                    if (db.data.users[m.sender].money < amount) 'Saldo tidak mencukupi.'

                    const maxSavingsLimit = 100000
                    if (userCouple.tabungan + amount > maxSavingsLimit) {
                        return m.reply(
                            `Deposit gagal. Melebihi batas maksimal tabungan *$${maxSavingsLimit.toLocaleString()}*\n` +
                            `Saldo saat ini: *$${userCouple.tabungan.toLocaleString()}*\n` +
                            `Maksimal deposit: *$${(maxSavingsLimit - userCouple.tabungan).toLocaleString()}*`)
                    }

                    db.data.users[m.sender].money -= amount
                    userCouple.tabungan += amount

                    coupleManager.saveCouples()

                    return m.reply(
                        `Berhasil deposit *$${amount.toLocaleString()}*\n` +
                        `Saldo tabungan: *$${userCouple.tabungan.toLocaleString()}*/$100.000`)

                case 'withdraw':
                    if (!amount || amount <= 0) 'Masukkan jumlah penarikan yang valid.'

                    const { withdrawalFee } = config.savingsConfig
                    const withdrawalAmount = amount * (1 + withdrawalFee)

                    if (userCouple.tabungan < withdrawalAmount) 'Saldo tabungan tidak mencukupi.'

                    userCouple.tabungan -= withdrawalAmount
                    db.data.users[m.sender].money += amount

                    coupleManager.saveCouples()

                    return m.reply(
                        `Berhasil tarik *$${amount.toLocaleString()}*\n` +
                        `Biaya admin: *$${(amount * withdrawalFee).toLocaleString()}*\n` +
                        `Saldo tabungan: *$${userCouple.tabungan.toLocaleString()}/$100.000*`)
                default:
                    return m.reply(
                        `*Pilihan Tabungan*\n\n` +
                        `*${usedPrefix}pas tabungan info* - Lihat saldo\n` +
                        `*${usedPrefix}pas tabungan deposit [jumlah]* - Deposit tabungan\n` +
                        `*${usedPrefix}pas tabungan withdraw [jumlah]* - Tarik tabungan`)
            }
        case 'event':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })

            if (!userCouple.events || userCouple.events.length === 0) 'Tidak ada event terbaru.'

            const latestEvent = userCouple.events[userCouple.events.length - 1]
            return m.reply(
                `*Event Terakhir*\n\n` +
                `Kejadian: *${latestEvent.event}*\n` +
                `Tanggal: *${new Date(latestEvent.date).toLocaleDateString()}*\n` +
                `Dampak: Hubungan ${latestEvent.impact > 0 ? 'membaik' : 'memburuk'}`)
        case 'status':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })
        
            const relationshipAssessment = coupleManager.assessRelationshipHealth(userCouple)
                
            let challengeText = "*Status Hubungan*\n\n"
            challengeText += `Skor Kesehatan Hubungan: ${relationshipAssessment.healthScore}/100\n`
            challengeText += `Risiko Putus: ${(relationshipAssessment.breakupChance * 100).toFixed(2)}%\n`
            challengeText += `Risiko Perselingkuhan: ${(relationshipAssessment.infidelityRisk * 100).toFixed(2)}%\n\n`
                
            challengeText += "*Faktor yang Mempengaruhi*:\n"
            challengeText += `- Komunikasi: ${userCouple.komunikasiLevel}/10.000\n`
            challengeText += `- Romantis: ${userCouple.romantikLevel}/100\n`
            challengeText += `- Kepercayaan: ${userCouple.trustLevel}/100`
        
            return conn.sendMessage(m.chat, { text: challengeText.trim() })
        case 'konseling':
            if (!userCouple) return conn.sendMessage(m.chat, { text: 'Kamu belum memiliki pasangan.' })
        
            const komunikasiImprovement = Math.floor(Math.random() * 20) + 10
            const trustImprovement = Math.floor(Math.random() * 15) + 5
            const romantikImprovement = Math.floor(Math.random() * 10) + 5
        
            userCouple.komunikasiLevel = Math.min(10000, userCouple.komunikasiLevel + komunikasiImprovement)
            userCouple.trustLevel = Math.min(100, userCouple.trustLevel + trustImprovement)
            userCouple.romantikLevel = Math.min(100, userCouple.romantikLevel + romantikImprovement)
        
            coupleManager.saveCouples()
        
            return m.reply(
                `*Hasil Konseling Hubungan* 💑\n\n` +
                `Komunikasi +${komunikasiImprovement}\n` +
                `Kepercayaan +${trustImprovement}\n` +
                `Romantis +${romantikImprovement}`)
        case 'help':
            let helpText = `💑 *PASANGAN COMMANDS*\n\n`
            helpText += `• pas cari [nama] - Mencari pasangan\n`
            helpText += `• pas putus - Mengakhiri hubungan\n`
            helpText += `• pas info - Melihat info hubungan\n`
            helpText += `• pas status - Melihat status hubungan\n`
            helpText += `• pas aktivitas [kegiatan] - Mencatat aktivitas bersama\n`
            helpText += `• pas nikah - Menikah dengan pasangan\n`
            helpText += `• pas anak tambah [nama] - Menambahkan anak\n`
            helpText += `• pas anak list - Melihat daftar anak\n`
            helpText += `• pas list - Melihat semua pasangan\n`
            helpText += `• pas lihat [nama] - Melihat info pasangan orang lain\n`
            helpText += `• pas setimage - Mengatur gambar pasangan (kirim/balas gambar)\n`
            helpText += `• pas romantic - Melihat status hubungan\n`
            helpText += `• pas romantic hadiah [nama hadiah] - Memberikan sesuatu ke pasangan`
            helpText += `• pas karier info/jatah - Kelola karier pasangan\n`
            helpText += `• pas tabungan info/deposit/withdraw - Kelola tabungan\n`
            helpText += `• pas event - Lihat event terakhir\n`
            helpText += `• pas konseling - Mekanisme meningkatkan metrik hubungan\n`
            helpText += `• obrolan [on/off] - Memulai obrolan dengan pasangan`

            return conn.sendMessage(m.chat, { text: helpText.trim() })
        default:
            return conn.sendMessage(m.chat, { text: `Perintah tidak valid. Ketik *${usedPrefix}pas help* untuk melihat panduan lengkap.` })
    }
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

function calculateRelationshipDuration(startDateString) {
    const startDate = new Date(startDateString)
    const currentDate = new Date()

    const diffTime = Math.abs(currentDate - startDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    const days = diffDays % 30

    let durationText = ''
    if (years > 0) durationText += `${years} tahun `
    if (months > 0) durationText += `${months} bulan `
    if (days > 0) durationText += `${days} hari`

    return durationText.trim() || '0 hari'
}

function calculateRomantikScore(activity) {
    const romanticActivities = [
        'kencan', 'romantis', 'makan malam', 'liburan', 'kado'
    ]

    const score = romanticActivities.some(r => activity.toLowerCase().includes(r)) ?
        Math.floor(Math.random() * 20) + 10 :
        Math.floor(Math.random() * 5)

    return score
}

function generateChildTraits() {
    const possibleTraits = [
        'Cerdas', 'Kreatif', 'Ramah', 'Pemalu', 'Energik',
        'Suka Musik', 'Suka Olahraga', 'Artistik'
    ]

    return {
        sifat: possibleTraits[Math.floor(Math.random() * possibleTraits.length)],
        bakat: possibleTraits[Math.floor(Math.random() * possibleTraits.length)]
    }
}

function calculateGiftImpact(giftName) {
    const specialGifts = ['cincin', 'bunga', 'cokelat', 'perhiasan']
    return specialGifts.some(gift => giftName.toLowerCase().includes(gift)) ?
        Math.floor(Math.random() * 15) + 10 :
        Math.floor(Math.random() * 5)
}

coupleSystem.help = ['pas']
coupleSystem.tags = ['pasangan']
coupleSystem.command = ['pas']

module.exports = coupleSystem