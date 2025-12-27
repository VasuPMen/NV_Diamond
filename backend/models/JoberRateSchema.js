import mongoose from "mongoose";

const joberRateSchema = new mongoose.Schema(
    {
        joberid :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Jober",
        },
        joberProcess : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Process",
        },
        from:{
            type: Number,
            required: true,
        },
        to:{
            type: Number,
            required: true,
        },
        rate:{
            type: Number,
            required: true,
        },
        rateType:{
            type: String,
            enum : ["issue Weight" , "return Weight" , "polish Weight" , "Fixed piece" , "Weight loss"],
        },
        rateCount:{
            type: String,
            enum : ["issue Weight" , "return Weight" , "polish Weight" ]
        },
        shape:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shape",
            }
        ],
        color:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color",
            }
        ],
        purity:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Purity",
            }
        ],
        cut:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cut",
            }
        ],
        polish:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Polish",
            }
        ],
        symmetry:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Symmetry",
            }
        ],
        stone:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stone",
            }
        ]
    }
)

export default mongoose.model("JoberRate", joberRateSchema);