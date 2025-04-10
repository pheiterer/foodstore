import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderModel } from "../models/order.model";
import { OrderStatus } from "../constants/order_status";
import auth from "../middlewares/auth.mid";

const router = Router();
router.use(auth);

router.post('/create',
  expressAsyncHandler(
    async (req:any, res:any) => {
      const requestOrder = req.body;

      if (requestOrder.items.lenght <= 0){
        res.status(HTTP_BAD_REQUEST).json({ Alert: 'Order must contain at least one item' });
        return;
      }

      await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW,
      });

      const newOrder = new OrderModel({...requestOrder, user: req.user.id});
      await newOrder.save();
      res.send(newOrder);
    }
));

router.get('/newOrderForCurrentUser',expressAsyncHandler(
  async (req:any, res:any) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).json({ Alert: 'No new order found for current user' });
  }
));

router.post('/pay', expressAsyncHandler(
  async (req:any, res:any) => {
    const {paymentId} = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(HTTP_BAD_REQUEST).json({ Alert: 'No new order found for current user' });
      return;
    }
    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();
    
    res.send(order._id);
}))

router.get('/track/:id', expressAsyncHandler(
  async (req:any, res:any) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      res.status(HTTP_BAD_REQUEST).json({ Alert: 'No order found' });
      return;
    }
    res.send(order);
  }
))

export default router;

async function getNewOrderForCurrentUser(req: any) {
  return await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });
}
