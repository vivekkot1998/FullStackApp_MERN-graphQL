const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { transformEvent, transformBooking } = require('./merge')



module.exports = {

    bookings: async (args, req) => {                  //args not needed but require req
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                //console.log(booking.updatedAt);
                return transformBooking(booking);
            });
        }catch(err){
            throw err;
        }
    },

    bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: '65f4a4d220526894735c1d4e',
            event: fetchedEvent,
        });
        const result = await booking.save();
        //console.log(result);
        return transformBooking(result);
    },

    cancelBooking: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
           await Booking.deleteOne({_id: args.bookingId});
           return event
        }catch(err){
            throw err;
        }
    }
}